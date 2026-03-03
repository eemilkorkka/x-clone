import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "../../../../ui/field";
import { CustomInput } from "../../../../customized/CustomInput";
import { SignupFormData } from "@/app/@modal/(.)signup/page";
import React, { SetStateAction } from "react";
import { FormButton } from "../FormButton";
import { useToastMessage } from "@/hooks/useToastMessage";

const verificationCodeSchema = z.object({
    verificationCode: z.string().min(6, "Verification code should be 6 digits long.").max(6, "Verification code should be 6 digits long.")
});

interface VerificationCodeProps {
    formData: SignupFormData;
    setFormData: React.Dispatch<SetStateAction<SignupFormData>>;
    setStep: React.Dispatch<SetStateAction<number>>;
}

export const VerificationCode = ({ formData, setFormData, setStep }: VerificationCodeProps) => {

    const { toastMessage } = useToastMessage();
    const form = useForm<z.infer<typeof verificationCodeSchema>>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            verificationCode: formData.verificationCode ?? ""
        }
    });

    const verificationCode = form.watch("verificationCode");

    const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
        setFormData(prev => ({ ...prev, verificationCode: data.verificationCode }));

        const response = await fetch("/api/signup/verify/check", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ email: formData.email, verificationCode: data.verificationCode })
        });

        const json = await response.json();

        if (!json.success) {
            toastMessage(json.message ?? "Something went wrong", false);
        } else {
            setStep(prev => prev + 1);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
            <Controller
                name="verificationCode"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <CustomInput
                            {...field}
                            type="text"
                            label="Verification code"
                            value={verificationCode}
                            maxLength={6}
                            fieldState={fieldState}
                            styles="text-white"
                        />
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                )}
            />
            <FormButton disabled={!verificationCode} />
        </form>
    )
}