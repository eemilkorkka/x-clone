import { PrismaClient } from "@/generated/prisma/client";
import z from "zod";

export const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const monthStringSchema = z.enum(monthsArray);

export const personalInfoSchema = z.object({
    name: z.string().min(1, "Name cannot be empty.").max(50),
    email: z.email(),
    month: monthStringSchema,
    day: z.coerce.number().int().min(1).max(31),
    year: z.coerce.number().int().min(1906).max(new Date().getFullYear())
}).refine((data) => {
    const monthIndex = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].indexOf(data.month) + 1;

    const daysInMonth = new Date(data.year, monthIndex, 0).getDate();
    return data.day <= daysInMonth;
}, {
    message: "Invalid day for the selected month",
    path: ["day"]
});

const createUsernameSchema = (checkAvailability: (username: string) => Promise<boolean>) => {
    return z.object({
        username: z.string()
            .min(4, "Username must contain at least 4 characters")
            .max(15, "Username cannot be longer than 15 characters.")
    }).superRefine(async (data, ctx) => {
        const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^`{|}~'.split('');

        const containsSpecialChar = specialChars.some((char) => data.username.includes(char));

        if (containsSpecialChar) {
            ctx.addIssue({
                code: "custom",
                message: "Username cannot contain any special characters except underscores.",

            });
        }

        const isAvailable = await checkAvailability(data.username);
        if (!isAvailable) {
            ctx.addIssue({
                code: "custom",
                message: "This username is taken.",
                path: ["username"]
            });
        }
    });
};

export const usernameSchema = createUsernameSchema(async (username) => {
    const response = await fetch(`/api/users/${username}`);
    return response.status === 404;
});

export const createUsernameSchemaBackend = (db: PrismaClient) => {
    return createUsernameSchema(async (username) => {
        const user = await db.user.findUnique({ where: { username } });
        return user === null;
    });
};

export const emailSchema = z.email().superRefine(async (data, ctx) => {
    const response = await fetch(`/api/users/${data}`);
    const isAvailable = response.status === 404;

    if (!isAvailable) {
        ctx.addIssue({
            code: "custom",
            message: "This email is taken.",
        });
    }
});

export const passwordSchema = z.object({
    password: z.string().min(8, "Password should at least be 8 characters long."),
    confirmPassword: z.string().min(8, "Password should at least be 8 characters long.")
}).superRefine((data, ctx) => {
    const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^`{|}~'.split('');
    const digits = '0123456789'.split('');
    const numberOfUppercaseChars = (data.password.match(/[A-Z]/g) || []).length;
    const numberOfLowercaseChars = (data.password.match(/[a-z]/g) || []).length;

    if (!specialChars.some((char) => data.password.includes(char))) {
        ctx.addIssue({
            code: "custom",
            message: "Password should contain at least one special character.",
            path: ["password"]
        });
    }

    if (!digits.some((digit) => data.password.includes(digit))) {
        ctx.addIssue({
            code: "custom",
            message: "Password should contain at least one digit.",
            path: ["password"]
        });
    }

    if (numberOfUppercaseChars < 1 || numberOfLowercaseChars < 1) {
        ctx.addIssue({
            code: "custom",
            message: "Password should contain both uppercase and lowercase letters.",
            path: ["password"]
        });
    }

    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match.",
            path: ["confirmPassword"]
        });
    }
});

export const userSchema = z.object({
    username_or_email: z.string().min(1, "Username or email is required.").superRefine(async (username_or_email, ctx) => {
        if (!username_or_email) {
            return;
        }

        const response = await fetch(`/api/users/${username_or_email}`);

        if (!response.ok) {
            ctx.addIssue({
                code: "custom",
                message: "Sorry, we couldn't find your user.",
                input: username_or_email
            });
        }
    })
});

export const editProfileFormSchema = z.object({
    displayName: z.string().max(50).min(1, "Name cannot be empty!"),
    bio: z.string().max(160).min(0).optional(),
    location: z.string().max(30).min(0).optional(),
    website: z.string().max(100).min(0).optional(),
    month: monthStringSchema.optional().or(z.literal("")),
    day: z.union([
        z.coerce.number().int().min(1).max(31),
        z.literal(""),
        z.undefined()
    ]).optional(),
    year: z.union([
        z.coerce.number().int().min(1906).max(new Date().getFullYear()),
        z.literal(""),
        z.undefined()
    ]).optional()
}).refine((data) => {
    if (!data.month || !data.day || !data.year ||
        data.month === "" || typeof data.day !== "number" || typeof data.year !== "number") {
        return true;
    }

    const monthIndex = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].indexOf(data.month) + 1;

    const daysInMonth = new Date(data.year, monthIndex, 0).getDate();
    return data.day <= daysInMonth;
}, {
    message: "Invalid day for the selected month",
    path: ["day"]
});