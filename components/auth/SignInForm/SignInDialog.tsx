"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { FaXTwitter, FaArrowLeft} from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { UserStep } from "./steps/UserStep";
import { PasswordStep } from "./steps/PasswordStep";

const stepTitles: string[] = ["Sign in to X", "Enter your password"];

export const SignInDialog = () => {

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        username_or_email: "",
        password: ""
    });

    const steps = [
        <UserStep setStep={setStep} setFormData={setFormData} setOpen={setOpen} />,
        <PasswordStep formData={formData} step={step} setStep={setStep} setOpen={setOpen} />
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full" render={
                <Button size="lg" className="bg-transparent border-1 border-zinc-500 rounded-full w-full font-bold py-5.5 hover:cursor-pointer">
                    Sign in
                </Button>
            }>
            </DialogTrigger>
            <DialogContent className="!max-w-[600px] h-full rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5" showCloseButton={false}>
                <DialogHeader className="relative flex flex-row justify-center items-center">
                    {step > 0 ? (
                        <FaArrowLeft size={23} className="absolute left-0 hover:cursor-pointer" onClick={() => setStep(prev => prev - 1)} />
                    ) : (
                        <IoMdClose size={23} className="absolute left-0 hover:cursor-pointer" onClick={() => setOpen(false)} />
                    )}
                    <FaXTwitter size={35} />
                </DialogHeader>
                <div className={`mx-auto ${step === 0 ? "max-w-xs" : "max-w-md"} w-full mt-2`}>
                    <DialogTitle className="text-3xl font-bold">{stepTitles[step]}</DialogTitle>
                    <div className="space-y-4 mt-8">
                        {steps[step]}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}