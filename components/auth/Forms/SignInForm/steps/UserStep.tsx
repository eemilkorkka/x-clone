import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignup } from "../../../GoogleSignup";
import { Separator } from "@/components/ui/seperator-with-text";
import { Field, FieldError } from "../../../../ui/field";
import { CustomInput } from "../../../../customized/CustomInput";
import { Button } from "../../../../ui/button";
import React, { SetStateAction } from "react";
import Link from "next/link";
import { userSchema } from "@/lib/schemas";

interface UserStepProps {
    setStep: React.Dispatch<SetStateAction<number>>;
    setFormData: React.Dispatch<SetStateAction<{
        username_or_email: string;
        password: string;
    }>>;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    formData: { username_or_email: string; password: string };
}

export const UserStep = ({ setStep, setFormData, setOpen, formData }: UserStepProps) => {

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username_or_email: formData.username_or_email ?? ""
        }
    });

    const onSubmit = async (data: z.infer<typeof userSchema>) => {
        setFormData({
            username_or_email: data.username_or_email,
            password: ""
        });
        setStep(1);
    }

    const username_or_email = form.watch("username_or_email");

    return (
        <>
            <GoogleSignup />
            <Separator />
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    name="username_or_email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="text"
                                label="Username or email"
                                value={username_or_email}
                                fieldState={fieldState}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <Button type="submit" size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full w-full mt-6 hover:cursor-pointer">Next</Button>
                <Link href="/forgot-password">
                    <Button size="lg" className="font-bold text-white hover:bg-ring/20 bg-transparent border-1 border-zinc-500 rounded-full w-full mt-6 hover:cursor-pointer">Forgot password?</Button>
                </Link>
            </form>
            <p className="mt-16 mb-20 text-zinc-500">Don't have an account?
                {' '}
                <Link href="/signup" onClick={() => setOpen(false)} className="text-sky-500 hover:underline hover:cursor-pointer">Sign up</Link>
            </p>
        </>
    )
}