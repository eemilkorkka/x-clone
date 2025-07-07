"use client";
import { Dialog } from "radix-ui";
import { IoClose } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { useState, ChangeEvent, JSX, MouseEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import MultiStepForm from "../Form/MultiStepForm";
import FindAccount from "./steps/FindAccount";
import Verify from "./steps/Verify";
import { FaArrowLeft } from "react-icons/fa6";
import { sendPasswordResetEmail } from "@/utils/utilFunctions";
import ResetPassword from "./steps/ResetPassword";
import toast from "react-hot-toast";

const ForgotPasswordDialog = () => {
    const router = useRouter();

    const [formInvalid, setFormInvalid] = useState<boolean>(true);
    const [step, setStep] = useState<number>(0);
    const [touchedFields, setTouchedFields] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        email_or_username: "",
        passwordResetCode: "",
        password: "",
        confirmPassword: ""
    });

    const stepTitles: string[] = ["Find your X account", "We sent you a code", "Choose a new password"];

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        !touchedFields.includes(name) && setTouchedFields(prev => [...prev, name]);

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleNextClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (step === 0) {
            const result = await sendPasswordResetEmail(formData.email_or_username);
            // In case the user entered their username, we will now swap it with their email that we got from the backend.
            if (!formData.email_or_username.includes("@")) setFormData(prev => ({...prev, email_or_username: result }));
            setStep(step + 1);
            setFormInvalid(true);
        } 
        else if (step < steps.length - 1) {
            setStep(step + 1);
            setFormInvalid(true);
        }
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/resetpassword", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ formData: formData })
            });
            
            const json = await response.json();

            if (response.ok) {
                toast.success(json.message);
            } else {
                toast.error(json.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const steps: JSX.Element[] = [
        <FindAccount formData={formData} onInputChange={onInputChange} setFormInvalid={setFormInvalid} touchedFields={touchedFields} />,
        <Verify formData={formData} onInputChange={onInputChange} setFormInvalid={setFormInvalid} touchedFields={touchedFields} />,
        <ResetPassword formData={formData} onInputChange={onInputChange} setFormInvalid={setFormInvalid} touchedFields={touchedFields} />
    ];

    return (
        <Dialog.Root open={true}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-700/50" />
                <Dialog.Content className="text-white w-full h-full lg:w-[600px] lg:h-[650px] flex flex-col gap-4 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black lg:rounded-2xl">
                    <div className="flex items-center justify-between p-3">
                        {step > 0 ? (
                            <FaArrowLeft size={20} className="hover:cursor-pointer" onClick={() => setStep(prev => prev - 1)} />
                        ) : (
                            <Dialog.Close asChild onClick={() => router.push("/")}>
                                <IoClose size={25} className="hover:cursor-pointer" />
                            </Dialog.Close>
                        )}
                        <FaXTwitter size={35} className="m-auto" />
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center lg:justify-start">
                        <div className="flex flex-col gap-4 h-full justify-between">
                            <div className="flex flex-col gap-2 h-full">
                                <Dialog.Title className="text-3xl font-bold">{stepTitles[step]}</Dialog.Title>
                                <MultiStepForm
                                    step={step}
                                    steps={steps}
                                    formInvalid={formInvalid}
                                    buttonText="Next"
                                    handleNextClick={(e) => handleNextClick(e)}
                                    handleFormSubmit={(e) => handleFormSubmit(e)}
                                />
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default ForgotPasswordDialog;