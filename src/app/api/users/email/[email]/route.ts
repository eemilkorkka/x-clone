import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ email: string }> }) {
    const { email } = await params;

    try {
        const user = await prisma.users.findFirst({
            where: {
                Email: email
            },
            select: {
                Username: true,
                DisplayName: true,
                ProfilePicture: true
            }
        })
        return user ? NextResponse.json({ user: user, message: "The email you entered is already in use." }, { status: 200 }) : NextResponse.json({ user: null }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}