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
        provider: "postgresql"
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
            }
        },
    },
    plugins: [
        username()
    ]
});