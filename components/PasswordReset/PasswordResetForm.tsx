"use client";

import { CustomInput } from "@/components/customized/CustomInput";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { passwordSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useRouter, useSearchParams } from "next/navigation";

export const PasswordResetForm = () => {

    const { toastMessage } = useToastMessage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    if (!token) {
        return <p className="text-center mt-20 text-2xl text-destructive">Invalid password reset link! ⚠️</p>;
    }

    const onSubmit = async (formData: z.infer<typeof passwordSchema>) => {
        const { data, error } = await authClient.resetPassword({
            newPassword: formData.password,
            token,
        });

        if (error) {
            form.setError("password", { message: error.message || "Failed to reset password. Please try again later." });
        } else {
            toastMessage("Password reset successful!", true);
            router.push("/");
        }
    }

    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-w-md mx-auto mt-20 px-4">
            <FieldGroup>
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <CustomInput
                                {...field}
                                label="New password"
                                type="password"
                                value={password}
                                fieldState={fieldState}
                                toggleToSeePassword={true}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <CustomInput
                                {...field}
                                label="Confirm new password"
                                type="password"
                                value={confirmPassword}
                                fieldState={fieldState}
                                toggleToSeePassword={true}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button type="submit" className="bg-sky-500 hover:bg-sky-600 rounded-full font-bold w-fit text-foreground mt-4 self-end px-4">Reset Password</Button>
        </form>
    )
}