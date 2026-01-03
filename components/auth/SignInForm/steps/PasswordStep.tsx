import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../../../ui/field";
import { CustomInput } from "../../../customized/CustomInput";
import { Button } from "../../../ui/button";
import React, { SetStateAction, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toastMessage } from "@/lib/toast";

const passwordStepSchema = z.object({
    password: z.string().min(1, "Password is required."),
    username_or_email: z.string().min(1, "Username or email is required.")
});

interface PasswordStepProps {
    formData: { username_or_email: string; password: string };
    step: number;
    setStep: React.Dispatch<SetStateAction<number>>;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export const PasswordStep = ({ formData, step, setStep, setOpen }: PasswordStepProps) => {

    const [loginError, setLoginError] = useState("");
    const form = useForm<z.infer<typeof passwordStepSchema>>({
        resolver: zodResolver(passwordStepSchema),
        defaultValues: {
            username_or_email: formData.username_or_email,
            password: ""
        }
    });

    const username_or_email = form.watch("username_or_email");
    const password = form.watch("password");

    const onSubmit = async (data: z.infer<typeof passwordStepSchema>) => {
        if (username_or_email.includes("@")) {
            await authClient.signIn.email({
                email: username_or_email,
                password: password,
                callbackURL: "/home"
            }, {
                onSuccess: () => {
                    toastMessage("Sign in successful.");
                },
                onError: (context) => {
                    setLoginError(context.error.message)
                }
            });
        } else {
            await authClient.signIn.username({
                username: username_or_email,
                password: password,
                callbackURL: "/home"
            }, {
                onSuccess: () => {
                    toastMessage("Sign in successful.", true);
                },
                onError: (context) => {
                    setLoginError(context.error.message)
                }
            });
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="username_or_email"
                    control={form.control}
                    disabled={true}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="text"
                                label="Username or email"
                                value={username_or_email}
                                fieldState={fieldState}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="password"
                                label="Password"
                                value={password}
                                fieldState={fieldState}
                                isPasswordInput={true}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            {loginError !== "" && <FieldError>{loginError}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
            <div className="space-y-4 mt-50 mb-4">
                <Button type="submit" disabled={!password} size="lg" variant="secondary" className="w-full font-bold rounded-full py-6 hover:cursor-pointer">Log in</Button>
                <p className="text-zinc-500">Don't have an account? <span className="text-sky-500 hover:underline hover:cursor-pointer">Sign up</span></p>
            </div>
        </form>
    )
}