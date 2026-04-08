"use client";

import { CustomInput } from "@/components/customized/CustomInput";
import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ui/ReturnBack";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { useColor } from "@/context/ColorContext";
import { useToastMessage } from "@/hooks/useToastMessage";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
    currentPassword: z.string()
}).and(passwordSchema);

export const ChangePasswordPage = () => {

    const { toastMessage } = useToastMessage();
    const { colors } = useColor();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { data: changePasswordData, error } = await authClient.changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.password,
            revokeOtherSessions: true
        });

        if (error) {
            form.setError("currentPassword", { message: error.message });
        } else {
            toastMessage("Password changed successfully.", true);
        }
    }

    const currentPassword = form.watch("currentPassword");
    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-xl font-bold">Change your password</h1>
            </FeedHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mt-4 px-8">
                <Controller
                    name="currentPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="password"
                                label="Current password"
                                value={currentPassword}
                                fieldState={fieldState}
                                styles="border-border"
                                toggleToSeePassword={true}
                            />

                            <Link href="/forgot-password" className={cn("text-sm ml-2 hover:underline", colors.textColor)}>Forgot password?</Link>
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <FieldGroup className="mt-6">
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <CustomInput
                                    {...field}
                                    type="password"
                                    label="Password"
                                    value={password}
                                    fieldState={fieldState}
                                    styles="border-border"
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
                            <Field data-invalid={fieldState.invalid}>
                                <CustomInput
                                    {...field}
                                    type="password"
                                    label="Confirm password"
                                    value={confirmPassword}
                                    fieldState={fieldState}
                                    styles="border-border"
                                    toggleToSeePassword={true}
                                />

                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <Button type="submit" className={cn("max-w-fit text-white self-end font-bold rounded-full px-4 mt-4 hover:cursor-pointer", colors.color, colors.hoverColor)}>Save</Button>
            </form>
        </div>
    )
}