import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { transporter } from "./nodemailer";
import { waitUntil } from '@vercel/functions';

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
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            waitUntil(
                transporter.sendMail({
                    to: user.email,
                    subject: "Verify your email",
                    text: `Proceed to this URL to verify your email: ${url}`
                })
            );
        }
    },
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
        requireEmailVerification: true,
        enabled: true,
    },
    appName: "X Clone",
    plugins: [
        twoFactor(),
        username({
            maxUsernameLength: 15,
        }),
    ]
});