import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { code, email } = await req.json();

    try {
        const dbCode = await prisma.verificationtokens.findUnique({
            where: {
                Email: email
            },
            select: {
                PasswordResetCode: true,
            }
        });

        return parseInt(code) === dbCode?.PasswordResetCode ? NextResponse.json({ message: "Success." }, { status: 200 }) :
        NextResponse.json({ message: "The code you entered is invalid." }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error.", error: error }, { status: 500 });
    }
}