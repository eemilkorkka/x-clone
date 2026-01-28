"use client";

import { DialogHeader } from "@/components/auth/Forms/DialogHeader";
import { ChoosePassword } from "@/components/auth/Forms/SignUpForm/steps/ChoosePassword";
import { ChooseUsername } from "@/components/auth/Forms/SignUpForm/steps/ChooseUsername";
import { PersonalInfo } from "@/components/auth/Forms/SignUpForm/steps/PersonalInfo";
import { VerificationCode } from "@/components/auth/Forms/SignUpForm/steps/VerificationCode";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useState } from "react";

const stepTexts = [
    {
        title: "Create your account",
    },
    {
        title: "We sent  you a code",
        description: "Enter it below to verify"
    },
    {
        title: "Choose your username"
    },
    {
        title: "Choose your password"
    }
];

export type SignupFormData = {
    name: string;
    email: string;
    month: string;
    day: string;
    year: string;
    verificationCode: string;
    username: string;
}

export default function SignupModal() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        month: "",
        day: "",
        year: "",
        verificationCode: "",
        username: "",
    });

    const steps = [
        <PersonalInfo formData={formData} setFormData={setFormData} setStep={setStep} />,
        <VerificationCode formData={formData} setFormData={setFormData} setStep={setStep} />,
        <ChooseUsername formData={formData} setFormData={setFormData} setStep={setStep} />,
        <ChoosePassword formData={formData} setFormData={setFormData} />
    ];

    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="flex flex-col !max-w-[600px] h-full min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5" showCloseButton={false}>
                <DialogHeader step={step} setStep={setStep} handleDialogClose={() => router.back()} />
                <div className="flex flex-1 flex-col mx-auto max-w-md w-full mt-2">
                    <div className="space-y-2">
                        <DialogTitle className="text-3xl font-bold">{stepTexts[step].title}</DialogTitle>
                        {stepTexts[step].description && <DialogDescription>{stepTexts[step].description}</DialogDescription>}
                    </div>
                    <div className="flex flex-col flex-1 space-y-4 mt-8">
                        {steps[step]}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}