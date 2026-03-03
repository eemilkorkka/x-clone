import { CustomInput } from "@/components/customized/CustomInput";
import { Field, FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod"
import { FormButton } from "../FormButton";
import { SignupFormData } from "@/app/@modal/(.)signup/page";
import React, { SetStateAction } from "react";
import { usernameSchema } from "@/lib/schemas";

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
                    <Field data-invalid={fieldState.invalid}>
                        <CustomInput
                            {...field}
                            type="text"
                            label="Username"
                            value={username}
                            maxLength={15}
                            fieldState={fieldState}
                            styles="text-white"
                        />
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                )}
            />
            <FormButton />
        </form>
    )
}