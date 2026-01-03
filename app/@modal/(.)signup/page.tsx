"use client";

import { ChoosePassword } from "@/components/auth/SignUpForm/steps/ChoosePassword";
import { ChooseUsername } from "@/components/auth/SignUpForm/steps/ChooseUsername";
import { PersonalInfo } from "@/components/auth/SignUpForm/steps/PersonalInfo";
import { VerificationCode } from "@/components/auth/SignUpForm/steps/VerificationCode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaXTwitter } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

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
    const pathname = usePathname();
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

    return pathname === "/signup" && (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="flex flex-col !max-w-[600px] h-full min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5" showCloseButton={false}>
                <DialogHeader className="relative flex h-fit flex-row justify-center items-center">
                    {step > 0 ? (
                        <FaArrowLeft size={23} className="absolute left-0 hover:cursor-pointer" onClick={() => setStep(prev => prev - 1)} />
                    ) : (
                        <IoMdClose size={23} className="absolute left-0 hover:cursor-pointer" onClick={() => router.back()} />
                    )}
                    <FaXTwitter size={35} />
                </DialogHeader>
                <div className="flex flex-1 justify-start flex-col justify-between mx-auto max-w-md w-full mt-2">
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