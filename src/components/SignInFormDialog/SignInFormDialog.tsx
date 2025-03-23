"use client";
import { useState, ReactNode, ChangeEvent, useEffect, FormEvent } from "react";
import { Dialog } from "radix-ui";
import { IoClose } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import GoogleSignIn from "../shared/GoogleSignIn";
import FormInput from "../form/FormInput";
import formDataType from "@/types/formDataType";
import Button from "../shared/Button";
import { DIALOG_EVENTS } from "@/utils/dialogEvents";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface SignInFormDialogProps {
    children: ReactNode;
}

const SignInFormDialog = ({ children }: SignInFormDialogProps) => {
    
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [hasSubmitted, setSubmitted] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");

    const [formData, setFormData] = useState<formDataType>({
        identifier: "",
        password: ""
    });

    useEffect(() => {
        const handleOpenSignin = () => setOpen(true);
        window.addEventListener(DIALOG_EVENTS.OPEN_SIGNIN, handleOpenSignin);
        return () => window.removeEventListener(DIALOG_EVENTS.OPEN_SIGNIN, handleOpenSignin);
    }, []);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitted(true);

        try {
            const result = await signIn("credentials", {
                email: formData.identifier,
                username: formData.identifier,
                password: formData.password,
                redirect: false
            });

            if (result?.error) {
                setSubmitted(false);
                setErrorText("Invalid credentials. Please try again.");
            } else {
                setOpen(false);
                setSubmitted(false);
                router.push("/home");
            }
        } catch (error) {
            setSubmitted(false);
            toast.error("Something went wrong");
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
                    <Dialog.Content className="text-white w-full h-full lg:w-[600px] lg:h-[650px] flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background bg-black lg:rounded-2xl">
                        <div className="flex items-center justify-between p-3">
                            <Dialog.Close asChild>
                                <IoClose size={25} className="hover:cursor-pointer" />
                            </Dialog.Close>
                            <FaXTwitter size={35} className="m-auto" />
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center lg:justify-start">
                            <div className="mt-5">
                                <Dialog.Title className="text-3xl font-bold">Sign in to X</Dialog.Title>
                                <div className="mt-5 flex flex-col gap-6">
                                    <GoogleSignIn buttonText="Sign in with Google" onClick={() => setSubmitted(true) } />
                                    <div className="flex items-center gap-3">
                                        <hr className="h-1 w-31 text-gray-600"></hr>
                                        <span>or</span>
                                        <hr className="h-1 w-31 text-gray-600"></hr>
                                    </div>
                                    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                                        <FormInput 
                                            type="text" 
                                            name="identifier" 
                                            label="Username or email" 
                                            formData={formData} 
                                            onChange={(e) => { onInputChange(e); setErrorText(""); }} 
                                        />
                                        <FormInput 
                                            type="password" 
                                            name="password" 
                                            label="Password" 
                                            formData={formData} 
                                            onChange={(e) => { onInputChange(e); setErrorText(""); }} 
                                        />
                                        <div className="flex justify-center">
                                            { errorText ? <p className="text-red-500">{errorText} </p> : hasSubmitted && <LoadingSpinner /> }
                                        </div>
                                        <Button type="submit" variant="white">Sign in</Button>
                                    </form>
                                    <Button variant="outline" textColor="white" hoverColor="white">Forgot password?</Button>
                                    <p>Don't have an account?
                                        <span className="text-xblue hover:cursor-pointer" onClick={() => {
                                            setOpen(false);
                                            window.dispatchEvent(new CustomEvent(DIALOG_EVENTS.OPEN_SIGNUP));
                                        }}> Sign up</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <Toaster />
        </>
    );
}

export default SignInFormDialog;