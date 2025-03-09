import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { email: string } }) {
    const { email } = params;

    try {
        const user = await prisma.users.findFirst({
            where: {
                Email: email
            }
        })
        return user ? NextResponse.json({ message: "The email you entered is already in use." }, { status: 200 }) : NextResponse.json({ user: null }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}