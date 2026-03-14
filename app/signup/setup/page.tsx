"use client";

import { DialogHeader } from "@/components/auth/Forms/DialogHeader";
import { FormButton } from "@/components/auth/Forms/SignUpForm/FormButton";
import { CustomInput } from "@/components/customized/CustomInput";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { usernameSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = usernameSchema.and(z.object({
    displayUsername: z.string().max(50).min(1, "Name cannot be empty!")
}));

export default function SetupPage() {

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            displayUsername: ""
        }
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const { data: updatedData, error } = await authClient.updateUser({
            username: data.username,
            displayUsername: data.displayUsername
        });
    }

    const username = form.watch("username");
    const displayUsername = form.watch("displayUsername");

    return (
        <div className="bg-black min-h-screen flex justify-center items-center">
            <Dialog open={true}>
                <DialogContent className="flex flex-col !max-w-[600px] h-full min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5" showCloseButton={false}>
                    <DialogHeader handleDialogClose={() => router.push("/")} />
                    <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
                        <DialogTitle className="text-3xl font-bold">Let's finish setting up your account</DialogTitle>
                        <form className="flex-1 flex flex-col justify-between mt-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="displayUsername"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <CustomInput
                                                {...field}
                                                type="text"
                                                label="Name"
                                                value={displayUsername}
                                                maxLength={50}
                                                fieldState={fieldState}
                                                styles="text-white"
                                            />
                                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                        </Field>
                                    )}
                                />
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
                                                styles="text-white"
                                            />
                                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                            <FormButton disabled={!username || !displayUsername} />
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}   