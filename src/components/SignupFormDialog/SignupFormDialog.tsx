"use client";
import { Dialog } from "radix-ui";
import { FormEvent, MouseEvent, ReactNode, useContext, useState, useEffect } from "react";
import { sendVerificationEmail } from "@/utils/utilFunctions";
import { IoClose } from "react-icons/io5";
import { FaXTwitter, FaArrowLeft } from "react-icons/fa6";
import PersonalInfo from "./steps/PersonalInfo";
import VerificationCode from "./steps/VerificationCode";
import Username from "./steps/Username";
import Password from "./steps/Password";
import MultiStepForm from "../Form/MultiStepForm";
import { SignupFormContext } from "@/Context/SignupFormContext";
import toast, { Toaster } from "react-hot-toast";
import { DIALOG_EVENTS } from "@/utils/dialogEvents";

interface SignupFormDialogProps {
    children: ReactNode
}

const stepTitles: string[] = ["Create your account", "We sent you a code", "Choose your username", "Choose a password"];

const SignupFormDialog = ({ children }: SignupFormDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);
    const { formData, formInvalid, setFormInvalid, setFormData } = useContext(SignupFormContext)!;

    useEffect(() => {
        const handleOpenSignup = () => setOpen(true);
        window.addEventListener(DIALOG_EVENTS.OPEN_SIGNUP, handleOpenSignup);
        return () => window.removeEventListener(DIALOG_EVENTS.OPEN_SIGNUP, handleOpenSignup);
    }, []);

    const steps: React.JSX.Element[] = [
        <PersonalInfo key={0} />,
        <VerificationCode key={1} />,
        <Username key={2} />,
        <Password key={3} />
    ];

    const handleNextClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (step === 0) {
            sendVerificationEmail(formData.email, formData.name);
            setFormData(prev => ({
                ...prev,
                verificationCode: ""
            }));
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
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        formData: formData
                })
            });
    
            const result = await response.json();
            
            if (response.status === 201) {
                toast.success(result.message); 
                setOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    {children}
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-gray-700/50"/>
                    <Dialog.Content className="text-white w-full h-full lg:w-[600px] lg:h-[650px] flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black lg:rounded-2xl">
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
                                handleNextClick={(e) => handleNextClick(e)}
                                handleFormSubmit={handleFormSubmit}
                            />
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <Toaster />
        </>
    );
}

export default SignupFormDialog;

