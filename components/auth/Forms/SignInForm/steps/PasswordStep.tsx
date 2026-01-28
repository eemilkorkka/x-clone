import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../../../../ui/field";
import { CustomInput } from "../../../../customized/CustomInput";
import { Button } from "../../../../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/hooks/useToastMessage";
import { FormButton } from "../../SignUpForm/FormButton";

const passwordStepSchema = z.object({
    password: z.string().min(1, "Password is required."),
    username_or_email: z.string().min(1, "Username or email is required.")
});

interface PasswordStepProps {
    formData: { username_or_email: string; password: string };
}

export const PasswordStep = ({ formData }: PasswordStepProps) => {

    const router = useRouter();
    const { toastMessage } = useToastMessage();
    
    const form = useForm<z.infer<typeof passwordStepSchema>>({
        resolver: zodResolver(passwordStepSchema),
        defaultValues: {
            username_or_email: formData.username_or_email,
            password: ""
        }
    });

    const username_or_email = form.watch("username_or_email");
    const password = form.watch("password");

    const onSubmit = async (data: z.infer<typeof passwordStepSchema>) => {
        if (username_or_email.includes("@")) {
            await authClient.signIn.email({
                email: username_or_email,
                password: password,
                callbackURL: "/home"
            }, {
                onSuccess: () => {
                    toastMessage("Sign in successful.", true);
                },
                onError: (context) => {
                    form.setError("password", { message: context.error.message });
                }
            });
        } else {
            await authClient.signIn.username({
                username: username_or_email,
                password: password,
            }, {
                onSuccess: () => {
                    toastMessage("Sign in successful.", true);
                    router.push("/home");
                },
                onError: (context) => {
                    form.setError("password", { message: context.error.message });
                }
            });
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
            <FieldGroup>
                <Controller
                    name="username_or_email"
                    control={form.control}
                    disabled={true}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <CustomInput
                                {...field}
                                type="text"
                                label="Username or email"
                                value={username_or_email}
                                fieldState={fieldState}
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || !!fieldState.error}>
                            <CustomInput
                                {...field}
                                type="password"
                                label="Password"
                                value={password}
                                fieldState={fieldState}
                                isPasswordInput={true}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                    )}
                />
            </FieldGroup>
            <div className="space-y-4 mb-4">
                <FormButton title="Log in" disabled={!password} />
                <p className="text-zinc-500">Don't have an account? <span className="text-sky-500 hover:underline hover:cursor-pointer">Sign up</span></p>
            </div>
        </form>
    )
}