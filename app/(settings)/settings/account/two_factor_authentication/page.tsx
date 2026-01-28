"use client";

import { CustomInput } from "@/components/customized/CustomInput";
import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { useColor } from "@/context/ColorContext";
import { useToastMessage } from "@/hooks/useToastMessage";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
    password: z.string()
});

export default function EnableTwoFactorAuthPage() {

    const { colors } = useColor();
    const { toastMessage } = useToastMessage();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { data: enable2FAData, error } = await authClient.twoFactor.enable({
            password: data.password,
            issuer: "X Clone",
        });

        if (error) {
            console.log(error);
            form.setError("password", { message: error.message });
        } else {
            toastMessage("Two-factor authentication enabled successfully!", true);
        }
    }

    const password = form.watch("password");

    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-xl font-bold">Enable Two-Factor Authentication</h1>
            </FeedHeader>
            <p className="text-zinc-500 text-sm mt-6 px-8">Make your account more secure by enabling two-factor authentication. To enable 2FA, you'll need to provide your password</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 flex flex-col">
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
                <Button disabled={!password} type="submit" className={cn("max-w-fit text-white self-end font-bold rounded-full px-4 mt-4 hover:cursor-pointer", colors.color, colors.hoverColor)}>Next</Button>
            </form>
        </div>
    )
}