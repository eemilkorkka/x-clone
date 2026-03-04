"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle
} from "@/components/ui/dialog";

import { DialogHeader } from "../auth/Forms/DialogHeader";
import { useRouter } from "next/navigation";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/schemas";
import { CustomInput } from "../customized/CustomInput";
import { Field, FieldError } from "../ui/field";
import { FormButton } from "../auth/Forms/SignUpForm/FormButton";
import { useToastMessage } from "@/hooks/useToastMessage";

export const ForgotPasswordDialog = () => {

    const router = useRouter();
    const { toastMessage } = useToastMessage();

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        mode: "onBlur",
        defaultValues: {
            username_or_email: ""
        }
    });

    const onSubmit = async (formData: z.infer<typeof userSchema>) => {
        try {
            const response = await fetch(`/api/request-password-reset?username_or_email=${formData.username_or_email}`, {
                method: "POST"
            });
            
            const json = await response.json();

            if (json.success) {
                toastMessage("Sent password recovery link to email.", true);
            } else {
                form.setError("username_or_email", { message: json.message || "Failed to request password reset." });
            }
        } catch (error) {
            form.setError("username_or_email", { message: "Something went wrong. Please try again later." });
        }
    }

    const username_or_email = form.watch("username_or_email");

    return (
        <Dialog open={true}>
            <DialogOverlay className="bg-black" />
            <DialogContent className="flex flex-col !max-w-[600px] min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5 ring-0" showCloseButton={false}>
                <DialogHeader handleDialogClose={() => router.back()} />
                <div className="flex flex-1 flex-col mx-auto max-w-md w-full mt-2">
                    <div className="space-y-2">
                        <DialogTitle className="text-3xl font-bold">Find your X account</DialogTitle>
                        <DialogDescription>Enter the email or username associated with your account to change your password.</DialogDescription>
                    </div>
                    <form className="flex flex-col flex-1 justify-between space-y-4 mt-8" onSubmit={form.handleSubmit(onSubmit)}>
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
                                        styles="text-white"
                                    />
                                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                </Field>
                            )}
                        />
                        <FormButton title="Next" disabled={!username_or_email} />
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}