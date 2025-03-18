"use client";
import { Dialog } from "radix-ui";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { sendVerificationEmail } from "@/utils/utilFunctions";
import { IoClose } from "react-icons/io5";
import { FaXTwitter, FaArrowLeft } from "react-icons/fa6";
import PersonalInfo from "./steps/PersonalInfo";
import formDataType from "../../types/formDataType";
import VerificationCode from "./steps/VerificationCode";
import Username from "./steps/Username";
import Password from "./steps/Password";
import MultiStepForm from "../MultiStepForm";

interface SignupFormDialogProps {
    children: ReactNode
}

const stepTitles: string[] = ["Create your account", "We sent you a code", "Choose your username", "Choose a password"];

const SignupFormDialog = ({ children }: SignupFormDialogProps) => {

    const [step, setStep] = useState<number>(0);
    const [touchedFields, setTouchedFields] = useState<string[]>([]);
    const [formInvalid, setFormInvalid] = useState<boolean>(true);

    const [formData, setFormData] = useState<formDataType>({
        name: "",
        email: "",
        birthDateMonth: "",
        birthDateDay: "",
        birthDateYear: "",
        verificationCode: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setTouchedFields(prev => [...prev, name]);

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === "name" ? value : value.trim(),
        }));
    }
    
    const steps: React.JSX.Element[] = [
        <PersonalInfo formData={formData} onChange={onInputChange} setFormInvalid={setFormInvalid} touchedFields={touchedFields} />,
        <VerificationCode formData={formData} onChange={onInputChange} setFormInvalid={setFormInvalid} setFormData={setFormData} touchedFields={touchedFields} />,
        <Username formData={formData} onChange={onInputChange} setFormInvalid={setFormInvalid} />,
        <Password formData={formData} onChange={onInputChange} setFormInvalid={setFormInvalid} />
    ];

    const handleNextClick = () => {
        if (step == 0) {
            sendVerificationEmail(formData.email, formData.name);
            setFormData(prev => ({
                ...prev,
                verificationCode: ""
            }));
            setStep(step + 1);
        }
        else if (step < steps.length - 1) {
            setStep(step + 1);
        }
        setFormInvalid(true);
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        formData: formData
                })
            });
    
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-700/50"/>
                <Dialog.Content className="w-full h-full lg:w-[600px] lg:h-[650px] flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background bg-black lg:rounded-2xl">
                    <div className="flex items-center justify-between p-3">
                        {step > 0 ? (
                            <FaArrowLeft size={20} className="hover:cursor-pointer" onClick={() => setStep(prev => prev - 1)} />
                        ) 
                        : (
                            <Dialog.Close asChild>
                                <IoClose size={25} className="hover:cursor-pointer" />
                            </Dialog.Close>
                        )}
                        <FaXTwitter size={35} className="m-auto" />
                    </div>
                    <div className="px-10 md:px-20 flex flex-col flex-1">
                        <Dialog.Title className="text-3xl font-bold mt-5 mb-5">{stepTitles[step]}</Dialog.Title>
                        <MultiStepForm 
                            step={step} 
                            steps={steps}
                            formInvalid={formInvalid}
                            handleNextClick={handleNextClick}
                            handleFormSubmit={handleFormSubmit}
                        />
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default SignupFormDialog;

