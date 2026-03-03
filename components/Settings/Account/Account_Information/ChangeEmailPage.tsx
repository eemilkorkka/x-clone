"use client";

import { CustomInput } from "@/components/customized/CustomInput";
import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { useColor } from "@/context/ColorContext";
import { useToastMessage } from "@/hooks/useToastMessage";
import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod";

const formSchema = z.object({
    email: emailSchema
});

export const ChangeEmailPage = () => {
    
    const { data } = authClient.useSession();
    const { toastMessage } = useToastMessage();
    const { colors } = useColor();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: data?.user.email || ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { data: updateData, error } = await authClient.changeEmail({
            newEmail: data.email,
            callbackURL: "/settings/your_twitter_data/account"
        });

        if (error) {
            form.setError("email", { message: error.message });
        } else {
            toastMessage("Confirmation email sent.", true);
        }
    }

    const email = form.watch("email");

    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-xl font-bold">Change email</h1>
            </FeedHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mt-4 px-8">
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                label="Email"
                                type="email"
                                value={email}
                                fieldState={fieldState}
                                styles="border-border"
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <Button type="submit" className={cn("max-w-fit text-white self-end font-bold rounded-full px-4 mt-4 hover:cursor-pointer", colors.color, colors.hoverColor)}>Save</Button>
            </form>
        </div>
    )
}