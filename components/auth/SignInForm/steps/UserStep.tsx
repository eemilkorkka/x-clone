import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { GoogleSignup } from "../../GoogleSignup";
import { Separator } from "../../../Separator";
import { Field, FieldError } from "../../../ui/field";
import { CustomInput } from "../../../CustomInput";
import { Button } from "../../../ui/button";
import React, { SetStateAction } from "react";
import Link from "next/link";

const userStepSchema = z.object({
    username_or_email: z.string().min(1, "Username or email is required.").superRefine(async (username_or_email, ctx) => {
        if (!username_or_email) {
            return;
        }

        const response = await fetch(`/api/users/${username_or_email}`);

        if (!response.ok) {
            ctx.addIssue({
                code: "custom",
                message: "Sorry, we couldn't find your user.",
                input: username_or_email
            });
        }
    })
});

interface UserStepProps {
    setStep: React.Dispatch<SetStateAction<number>>;
    setFormData: React.Dispatch<SetStateAction<{
        username_or_email: string;
        password: string;
    }>>;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export const UserStep = ({ setStep, setFormData, setOpen }: UserStepProps) => {

    const form = useForm<z.infer<typeof userStepSchema>>({
        resolver: zodResolver(userStepSchema),
        defaultValues: {
            username_or_email: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof userStepSchema>) => {
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
            <Separator text="OR" />
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
                <Button type="submit" size="lg" variant="secondary" className="rounded-full w-full mt-6 hover:cursor-pointer">Next</Button>
                <Button size="lg" variant="outline" className="bg-transparent rounded-full w-full mt-6 hover:cursor-pointer">Forgot password?</Button>
            </form>
            <p className="mt-16 mb-20 text-zinc-500">Don't have an account?
                {' '}
                <Link href="/signup" onClick={() => setOpen(false)} className="text-sky-500 hover:underline hover:cursor-pointer">Sign up</Link>
            </p>
        </>
    )
}