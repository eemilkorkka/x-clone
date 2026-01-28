import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../../../../ui/field";
import { CustomInput } from "../../../../customized/CustomInput";
import { SignupFormData } from "@/app/@modal/(.)signup/page";
import React, { SetStateAction } from "react";
import { FormButton } from "../FormButton";
import { useMutation } from "@tanstack/react-query";
import { BirthdateDropdowns, monthStringSchema } from "../BirthdateDropdowns";
import { emailSchema } from "@/lib/schemas";
import { useToastMessage } from "@/hooks/useToastMessage";

const personalInfoSchema = z.object({
    name: z.string().min(1, "Name cannot be empty.").max(50),
    email: emailSchema,
    month: monthStringSchema,
    day: z.coerce.number().int().min(1).max(31),
    year: z.coerce.number().int().min(1906).max(new Date().getFullYear())
}).refine((data) => {
    const monthIndex = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].indexOf(data.month) + 1;

    const daysInMonth = new Date(data.year, monthIndex, 0).getDate();
    return data.day <= daysInMonth;
}, {
    message: "Invalid day for the selected month",
    path: ["day"]
});

interface PersonalInfoProps {
    formData: SignupFormData;
    setFormData: React.Dispatch<SetStateAction<SignupFormData>>;
    setStep: React.Dispatch<SetStateAction<number>>;
}

const verificationCodeRequest = async (email: string) => {
    const response = await fetch("/api/signup/verify/send", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email: email })
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to continue with the signup process, try again later.");
    }
}

export const PersonalInfo = ({ formData, setFormData, setStep }: PersonalInfoProps) => {

    const { toastMessage } = useToastMessage();
    
    const form = useForm<z.input<typeof personalInfoSchema>>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: formData.name ?? "",
            email: formData.email ?? "",
            month: formData.month ?? "",
            day: formData.day ?? "",
            year: formData.year ?? ""
        }
    });

    const name = form.watch("name");
    const email = form.watch("email");
    const month = form.watch("month");
    const day = form.watch("day");
    const year = form.watch("year");

    const { isPending, mutateAsync } = useMutation({
        mutationFn: verificationCodeRequest,
        onSuccess: () => {
            setStep(prev => prev + 1);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "Something went wrong.", false);
        }
    });

    const onSubmit = async (data: z.input<typeof personalInfoSchema>) => {
        const validatedData = personalInfoSchema.parse(data);

        setFormData(prev => (
            {
                ...prev,
                name: validatedData.name,
                email: validatedData.email,
                month: validatedData.month,
                day: validatedData.day.toString(),
                year: validatedData.year.toString()
            }
        ));

        mutateAsync(data.email);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="text"
                                label="Name"
                                value={name}
                                maxLength={50}
                                fieldState={fieldState}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="email"
                                label="Email"
                                value={email}
                                fieldState={fieldState}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <div className="space-y-2 mb-4">
                    <p className="font-bold">Date of birth</p>
                    <p className="text-zinc-500">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                </div>
                <BirthdateDropdowns form={form} month={month} day={day} year={year} />
            </FieldGroup>
            <FormButton disabled={!name || !email || !month || !day || !year || isPending} />
        </form>
    )
}