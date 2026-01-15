import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    user: {
        additionalFields: {
            profileBannerImage: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true
            },
            bio: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true
            },
            website: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true
            },
            location: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true
            },
            birthDateMonth: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true
            },
            birthDateDay: {
                type: "number",
                required: false,
                defaultValue: null,
                input: true
            },
            birthDateYear: {
                type: "number",
                required: false,
                defaultValue: null,
                input: true
            }
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username({
            maxUsernameLength: 15
        }),
    ]
});