import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const { email, name } = await req.json();
    const code: number = await Math.floor(100000 + Math.random() * 900000);
    try {
        await storeVerificationCode(email, code);

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Verification code for XClone",
            text: `Hello, ${name}! Your verification code for XClone is ${code}`
        });

        return NextResponse.json({ message: "Email sent successfully!"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const storeVerificationCode = async (email: string, code: number) => {
    try {
        const user = await prisma.verificationtokens.findFirst({
            where: {
                Email: email
            }
        });

        if (user) {
            await prisma.verificationtokens.update({
                where: {
                    Email: email
                },
                data: {
                    Code: code
                }
            });
        }
        else {
            await prisma.verificationtokens.create({
                data: {
                    Email: email,
                    Code: code
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}