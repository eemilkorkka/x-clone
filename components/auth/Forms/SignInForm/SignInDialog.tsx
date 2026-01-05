"use client";
import { Button } from "@/components/ui/button";

import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";

import { useState } from "react";
import { UserStep } from "./steps/UserStep";
import { PasswordStep } from "./steps/PasswordStep";
import { DialogHeader } from "../DialogHeader";

const stepTitles: string[] = ["Sign in to X", "Enter your password"];

export const SignInDialog = () => {

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        username_or_email: "",
        password: ""
    });

    const steps = [
        <UserStep setStep={setStep} setFormData={setFormData} setOpen={setOpen} formData={formData} />,
        <PasswordStep formData={formData} step={step} />
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full" render={
                <Button size="lg" className="bg-transparent border-1 border-zinc-500 rounded-full w-full font-bold py-5.5 hover:cursor-pointer">
                    Sign in
                </Button>
            }>
            </DialogTrigger>
            <DialogContent className="flex flex-col !max-w-[600px] h-full min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5" showCloseButton={false}>
                <DialogHeader step={step} setStep={setStep} handleDialogClose={() => setOpen(false)} />
                <div className={`flex flex-1 flex-col mx-auto ${step === 0 ? "max-w-xs" : "max-w-md"} w-full mt-2`}>
                    <DialogTitle className="text-3xl font-bold">{stepTitles[step]}</DialogTitle>
                    <div className="flex-1 flex flex-col space-y-4 mt-8">
                        {steps[step]}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}