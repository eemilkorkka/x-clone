import { CustomInput } from "@/components/customized/CustomInput";
import { Field, FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod"
import { FormButton } from "../FormButton";
import { SignupFormData } from "@/app/@modal/(.)signup/page";
import React, { SetStateAction } from "react";

const usernameSchema = z.object({
    username: z.string()
        .min(4, "Username must contain at least 4 characters")
        .max(15, "Username cannot be longer than 15 characters.")
}).superRefine(async (username, ctx) => {
    const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^`{|}~'.split('');

    const containsSpecialChar = specialChars.some((char) => username.username.includes(char));

    if (containsSpecialChar) {
        ctx.addIssue({
            code: "custom",
            message: "Username cannot contain any special characters except underscores.",
            path: ["username"]
        });
    }

    const response = await fetch(`/api/users/${username.username}`);

    if (response.status !== 404) {
        ctx.addIssue({
            code: "custom",
            message: "This username is taken.",
            path: ["username"]
        });
    }
});

interface ChooseUsernameProps {
    formData: SignupFormData;
    setFormData: React.Dispatch<SetStateAction<SignupFormData>>;
    setStep: React.Dispatch<SetStateAction<number>>;
}

export const ChooseUsername = ({ formData, setFormData, setStep }: ChooseUsernameProps) => {

    const form = useForm<z.infer<typeof usernameSchema>>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: formData.username ?? ""
        },
        mode: "onBlur"
    });

    const username = form.watch("username");

    const onSubmit = (data: z.infer<typeof usernameSchema>) => {
        setFormData(prev => ({ ...prev, username: data.username }));
        setStep(prev => prev + 1);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
            <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <CustomInput
                            {...field}
                            type="text"
                            label="Username"
                            value={username}
                            maxLength={15}
                            fieldState={fieldState}
                        />
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                )}
            />
            <FormButton />
        </form>
    )
}