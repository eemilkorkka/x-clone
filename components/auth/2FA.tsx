"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { useToastMessage } from "@/hooks/useToastMessage";
import { cn } from "@/lib/utils";
import { CustomInput } from "../customized/CustomInput";

export const formSchema = z.object({
    verificationCode: z.string().min(6).max(6)
});

interface TwoFactorAuthProps {
    children: React.ReactNode;
    styles?: string;
}

export const TwoFactorAuth = ({ children, styles }: TwoFactorAuthProps) => {

    const router = useRouter();
    const { toastMessage } = useToastMessage();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verificationCode: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { data, error } = await authClient.twoFactor.verifyTotp({
            code: values.verificationCode,
            trustDevice: true,
        });

        if (error && error.message) {
            form.setError("verificationCode", { message: error.message });
        } else {
            toastMessage("Two-factor Authentication successful.", true);
            router.push("/home");
        }
    }

    const verificationCode = form.watch("verificationCode");

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex-1 flex flex-col", styles)}>
            <FieldGroup>
                <Controller
                    name="verificationCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <CustomInput
                                {...field}
                                type="text"
                                maxLength={6}
                                label="Verification code"
                                value={verificationCode}
                                fieldState={fieldState}
                                styles="text-foreground border-border shadow-none"
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
            {children}
        </form>
    )
}