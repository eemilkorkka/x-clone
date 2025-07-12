import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const personalInfoSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").max(50),
    email: z.string()
        .email("Please enter a valid email address")
        .refine(async (email) => {
            if (!emailRegex.test(email)) return
            try {
                const response = await fetch(`/api/users/email/${encodeURIComponent(email)}`);
                return response.status === 404;
            } catch (error) {
                return error;
            }
        }, "This email is already taken"),
    birthDateMonth: z.string().min(1),
    birthDateDay: z.string().min(1),
    birthDateYear: z.string().min(1),
});

export const editProfileSchema = z.object({
    name: z.string().min(1).max(50),
    bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
    location: z.string().max(30, "Location cannot exceed 30 characters").optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    birthDateMonth: z.string(),
    birthDateDay: z.string(),
    birthDateYear: z.string()
});

export const verificationCodeSchema = z.object({
    email: z.string(),
    verificationCode: z.string().min(6, "").max(6, "The verification code you entered is invalid")
}).superRefine(async (data, ctx) => {
    if (data.verificationCode.length > 6 || data.verificationCode.length < 6) return;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/code`, {
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
        console.log(error);
        
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Something went wrong",
            path: ["verificationCode"]
        });
    }
});

export const usernameSchema = z.object({
    username: z.string().min(1, "Username cannot be empty")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and dashes")
        .refine((username) => username.length >= 4 && username.length <= 15, {
            message: "Username should be between 4 and 15 characters"
        })
        .refine(async (username) => {
            try {
                const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
                return response.status === 404;
            } catch (error) {
                return error;
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

export const emailOrUsernameSchema = z.object({
    email_or_username: z.string().min(4, "Enter a valid username or email.")
}).superRefine(async (val, ctx) => {
    const str = val.email_or_username;
    const url = str.includes("@") ? `/api/users/email/${encodeURIComponent(str)}` : `/api/users/${encodeURIComponent(str)}`;

    try {
        const response = await fetch(url);
        if (response.status !== 200) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `We couldn't find the account associated with the email \n or username you provided.`,
                path: ["email_or_username"]
            });
        }
    } catch {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Something went wrong",
            path: ["email_or_username"]
        });
    }
});

export const passwordResetCodeSchema = z.object({
    passwordResetCode: z.string().min(6, "").max(6, "The code you entered is invalid."),
    email_or_username: z.string()
}).superRefine(async (data, ctx) => {
    if (data.passwordResetCode.length > 6 || data.passwordResetCode.length < 6) return;

    try {
        const response = await fetch("/api/resetpassword/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code: data.passwordResetCode, email: data.email_or_username })
        });
        if (response.status !== 200) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "The code you entered is invalid.",
                path: ["passwordResetCode"]
            });
        }
    } catch {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Something went wrong.",
            path: ["passwordResetCode"]
        });
    }
})