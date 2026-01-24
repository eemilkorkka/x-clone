"use client";

import { CustomInput } from "@/components/customized/CustomInput";
import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { useColor } from "@/context/ColorContext";
import { useToastMessage } from "@/hooks/useToastMessage";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { usernameSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function UsernameSettingsPage() {

    const { data: sessionData } = authClient.useSession();
    const { colors } = useColor();
    const queryClient = getQueryClient();
    const router = useRouter();
    const { toastMessage } = useToastMessage();

    const form = useForm<z.infer<typeof usernameSchema>>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: sessionData?.user.username || ""
        }
    });

    const onSubmit = async (data: z.infer<typeof usernameSchema>) => {
        const result = await authClient.updateUser({
            username: data.username,
            displayUsername: sessionData?.user.displayUsername || ""
        });

        if (!result.error) {
            toastMessage("Username changed successfully!", true);
            queryClient.invalidateQueries({ queryKey: ["user", sessionData?.user.username] });
            router.refresh();
            router.back();
        } else {
            toastMessage(result.error.message ?? "Failed to update profile", false);
        }
    }

    const username = form.watch("username");

    if (!sessionData) {
        return null;
    }

    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-xl font-bold">Change username</h1>
            </FeedHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mt-2 px-6">
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
                                fieldState={fieldState}
                                styles="text-black border-gray-300 shadow-none"
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
                <Button type="submit" className={cn("max-w-fit self-end font-bold rounded-full px-4 mt-4 hover:cursor-pointer", colors.color, colors.hoverColor)}>Save</Button>
            </form>
        </div>
    )
}