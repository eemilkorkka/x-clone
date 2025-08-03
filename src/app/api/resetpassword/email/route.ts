import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
});

export async function POST(req: Request) {
    const { email_or_username } = await req.json();

    const user = await prisma.users.findFirst({
        where: {
            OR: [
                { Email: email_or_username },
                { Username: email_or_username }
            ]
        },
        select: {
            Email: true,
            Name: true,
        }
    });

    if (!user) return NextResponse.json({ message: "Could not find user." }, { status: 404 });

    const code: number = Math.floor(100000 + Math.random() * 900000);
    const email = email_or_username.includes("@") ? email_or_username : user.Email;

    try {
        await storePasswordResetCode(email, code);

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Password reset code for XClone",
            text: `Hello, ${user.Name}! Your password reset code for XClone is ${code}`
        });

        return NextResponse.json({ message: "Email sent successfully!", email: user.Email }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error.", error: error }, { status: 500 });
    }
}

const storePasswordResetCode = async (email: string, code: number) => {
    const user = await prisma.verificationtokens.findUnique({
        where: {
            Email: email
        }
    });

    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    if (user) {
        await prisma.verificationtokens.update({
            where: {
                Email: email
            },
            data: {
                PasswordResetCode: code,
                PasswordResetCodeExpiry: expirationTime
            }
        });
    } else {
        await prisma.verificationtokens.create({
            data: {
                Email: email,
                PasswordResetCode: code,
                PasswordResetCodeExpiry: expirationTime
            }
        });
    }
}   