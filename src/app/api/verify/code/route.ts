import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, verificationCode } = await req.json();

    try {
        const dbCode = await prisma.verificationtokens.findFirst({
            select: {
                Code: true
            },
            where: {
                Email: email
            }
        });

        if (dbCode) {
            return verificationCode == dbCode.Code ? 
            NextResponse.json({ message: "Success."}, { status: 200 }) : 
            NextResponse.json({ message: "The verification code you entered is invalid."}, { status: 401 });
        }
        else {
            return NextResponse.json({ message: "Could not find verification code."}, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error."}, { status: 500 });
    }
}