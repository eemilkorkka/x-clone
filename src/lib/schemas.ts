import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const personalInfoSchema = z.object({
    name: z.string().min(1).max(50),
    email: z.string()
        .email("Please enter a valid email address")
        .refine(async (email) => {
            if (!emailRegex.test(email)) return
            try {
                const response = await fetch(`http://localhost:3000/api/users/email/${encodeURIComponent(email)}`);
                return response.status === 404;
            } catch {
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
        const response = await fetch('http://localhost:3000/api/verify/code', {
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
    } catch {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Something went wrong",
            path: ["verificationCode"]
        });
    }
});

export const usernameSchema = z.object({
    username: z.string()
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and dashes")
        .refine((username) => username.length >= 4 && username.length <= 15, {
            message: "Username should be between 4 and 15 characters"
        })
        .refine(async (username) => {
            try {
                const response = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(username)}`);
                return response.status === 404;
            } catch {
                return false;
            }
        }, "Username is already in use")
});

export const passwordSchema = z.object({
    password: z.string()
        .min(8, "Password should be at least 8 characters long")
        .max(100, "Password cannot exceed 100 characters")
        .refine((password) => /[A-Z]/.test(password), "Password should contain at least one uppercase letter")
        .refine((password) => /[a-z]/.test(password), "Password should contain at least one lowercase letter")
        .refine((password) => /[0-9]/.test(password), "Password should contain at least one number")
        .refine((password) => /[!@#$%&*]/.test(password), "Password should contain at least one of the following special symbols: !@#$%&*"),
    confirmPassword: z.string()
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"]
        });
    }
});