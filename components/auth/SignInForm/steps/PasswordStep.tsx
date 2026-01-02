import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignup } from "../../GoogleSignup";
import { Separator } from "../../../Separator";
import { Field, FieldError, FieldGroup } from "../../../ui/field";
import { CustomInput } from "../../../CustomInput";
import { Button } from "../../../ui/button";
import React, { SetStateAction } from "react";

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

    const form = useForm<z.infer<typeof passwordStepSchema>>({
        resolver: zodResolver(passwordStepSchema),
        defaultValues: {
            username_or_email: formData.username_or_email,
            password: ""
        }
    });

    const username_or_email = form.watch("username_or_email");
    const password = form.watch("password");

    const onSubmit = (data: z.infer<typeof passwordStepSchema>) => {

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
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
            <div className="space-y-4 mt-50 mb-4">
                <Button disabled={!password} size="lg" variant="secondary" className="w-full rounded-full py-6 hover:cursor-pointer">Log in</Button>
                <p className="text-zinc-500">Don't have an account? <span className="text-sky-500 hover:underline hover:cursor-pointer">Sign up</span></p>
            </div>
        </form>
    )
}