import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, verificationCode } = await req.json();

    try {
        const data = await prisma.signupVerification.findUnique({
            where: {
                email: email
            }
        });

        if (!data) {
            return NextResponse.json({ message: "Couldn't find verification code for this email." }, { status: 404 });
        }

        const EXPIRY_DURATION = 10 * 60 * 1000;
        const expiryTime = new Date(data.createdAt.getTime() + EXPIRY_DURATION);
        const isExpired = new Date() > expiryTime;

        if (isExpired) {
            return NextResponse.json({ message: "Verification code has expired." }, { status: 410 });
        }

        if (Number(verificationCode) !== data.verificationCode) {
            return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}