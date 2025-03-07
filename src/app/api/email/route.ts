const nodemailer = require("nodemailer");
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
    const { email, name, subject, text } = await req.json();

    try {
        const mail = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: `Hello, ${name}! ${text}`
        });

        return NextResponse.json({ message: "Verification code sent successfully!"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}