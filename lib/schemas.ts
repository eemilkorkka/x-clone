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
                path: ["username"]
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

export const usernameSchemaFrontend = createUsernameSchema(async (username) => {
    const response = await fetch(`/api/users/${username}`);
    return response.status === 404;
});

export const createUsernameSchemaBackend = (db: PrismaClient) => {
    return createUsernameSchema(async (username) => {
        const user = await db.user.findUnique({ where: { username } });
        return user === null;
    });
};