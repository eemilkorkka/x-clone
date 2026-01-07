const crypto = require("crypto");
import { transporter } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Request) {

    const { email } = await req.json();

    const validateResult = z.email().safeParse(email);

    if (!validateResult.success) {
        return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    const verificationCode = crypto.randomInt(100000, 999999);

    try {
        await transporter.sendMail({
            to: email,
            subject: "Verification code",
            text: `Use this verification code to continue with the signup process: ${verificationCode}`
        });

        await prisma.signupVerification.upsert({
            where: {
                email: email
            },
            update: {
                verificationCode: verificationCode,
                createdAt: new Date(Date.now())
            },
            create: {
                email: email,
                verificationCode: verificationCode
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}