import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { transporter } from "./nodemailer";
import { waitUntil } from '@vercel/functions';

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, newEmail, url, token }, request) => {
                waitUntil(
                    transporter.sendMail({
                        to: newEmail,
                        subject: "Approve email change",
                        text: `Proceed to this URL to confirm your new email: ${url}`
                    })
                );
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url, token }, request) => {
                waitUntil(
                    transporter.sendMail({
                        to: user.email,
                        subject: "Confirm account deletion",
                        text: `Proceed to this URL to confirm your account deletion: ${url}`
                    })
                );
            }
        },
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
        sendResetPassword: async ({ user, url, token }, request) => {
            waitUntil(
                transporter.sendMail({
                    to: user.email,
                    subject: "Reset your password",
                    text: `Click the link to reset your password: ${url}`,
                })
            )
        }
    },
    appName: "X Clone",
    plugins: [
        twoFactor(),
        username({
            maxUsernameLength: 15,
        }),
    ]
});