import { SignupFormData } from "@/app/@modal/(.)signup/page";
import { CustomInput } from "@/components/customized/CustomInput";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod"
import { FormButton } from "../FormButton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/hooks/useToastMessage";
import { passwordSchema } from "@/lib/schemas";

interface ChoosePasswordProps {
    formData: SignupFormData;
    setFormData: React.Dispatch<SetStateAction<SignupFormData>>;
}

export const ChoosePassword = ({ formData, setFormData }: ChoosePasswordProps) => {
    const router = useRouter();
    const { toastMessage } = useToastMessage();

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
        const { data: signupData, error } = await authClient.signUp.email({
            email: formData.email,
            password: data.password,
            name: formData.name,
            username: formData.username,
            displayUsername: formData.username,
            birthDateMonth: formData.month,
            birthDateDay: Number(formData.day),
            birthDateYear: Number(formData.year)
        }, {
            onSuccess: (ctx) => {
                toastMessage("Signup successful!", true);
                router.push("/");
            },
            onError: (ctx) => {
                toastMessage(ctx.error.message ?? "Signup failed, try again later.", false);
            }
        });
    }
    
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
            <FieldGroup>
                <Controller 
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <CustomInput 
                                {...field}
                                label="Password"
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
                                label="Confirm password"
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
            <FormButton />
        </form>
    )
}