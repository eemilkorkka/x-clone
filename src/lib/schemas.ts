import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailFormatSchema = z.string().email("Please enter a valid email address");

export const personalInfoSchema = z.object({
    name: z.string().min(1),
    email: emailFormatSchema
        .refine(async (email) => {
            if (!emailRegex.test(email)) return
            try {
                const response = await fetch(`/api/users/email/${encodeURIComponent(email)}`);
                return response.status === 404;
            } catch (error) {
                return false;
            }
        }, "This email is already taken"),
    birthDateMonth: z.string().min(1),
    birthDateDay: z.string().min(1),
    birthDateYear: z.string().min(1),
});

export const verificationCodeSchema = z.object({
    email: z.string(),
    verificationCode: z.string().min(6, "").max(6, "The verification code you entered is invalid")
}).superRefine(async (data, ctx) => {
    if (data.verificationCode.length > 6 || data.verificationCode.length < 6) return;
    try {
        const response = await fetch('/api/verify/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: data.email,
                verificationCode: data.verificationCode 
            })
        });
        if (response.status !== 200) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "The verification code you entered is invalid",
                path: ["verificationCode"]
            });
        }
    } catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Something went wrong",
            path: ["verificationCode"]
        });
    }
});