import { CustomInput } from "@/components/customized/CustomInput";
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

interface PasswordStepProps {
    setStep?: React.Dispatch<React.SetStateAction<number>>;
    setQrCode?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PasswordStep = ({ setStep, setQrCode }: PasswordStepProps) => {

    const { colors } = useColor();
    const { toastMessage } = useToastMessage();
    const { data: sessionData } = authClient.useSession();
    const is2FAEnabled = sessionData?.user?.twoFactorEnabled;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!is2FAEnabled) {
            const { data: enable2FAData, error } = await authClient.twoFactor.enable({
                password: data.password,
                issuer: "X Clone",
            });

            if (error) {
                form.setError("password", { message: error.message ?? "Internal Server Error" });
            } else {
                const { data: totpData, error } = await authClient.twoFactor.getTotpUri({
                    password: data.password,
                });

                if (!error) {
                    setQrCode?.(totpData.totpURI || "");
                    setStep?.(1);
                }
            }
        } else {
            const { data: disable2FAData, error } = await authClient.twoFactor.disable({
                password: data.password,
            });

            if (error) {
                form.setError("password", { message: error.message ?? "Internal Server Error" });
            } else {
                toastMessage("Two-factor Authentication disabled successfully.", true);
            }
        }
    }

    const password = form.watch("password");

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
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
                            styles="border-border"
                        />
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                )}
            />
            <Button disabled={!password} type="submit" variant={is2FAEnabled ? "destructive" : "default"} className={cn("max-w-fit text-white self-end font-bold rounded-full px-4 mt-4 hover:cursor-pointer",
                is2FAEnabled ? "bg-destructive hover:bg-destructive hover:brightness-[95%]" : `${colors.color} ${colors.hoverColor}`)}
            >
                {is2FAEnabled ? "Confirm" : "Continue"}
            </Button>
        </form>
    )
}