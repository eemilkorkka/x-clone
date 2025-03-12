import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { username: string }}) {
    const { username } = params;

    const user = await prisma.users.findFirst({
        omit: {
            Password: true,
            BirthDateMonth: true,
            BirthDateDay: true,
            BirthDateYear: true,
            Email: true
        },
        where: {
            Username: username
        }
    });

    return user ? NextResponse.json({ user: user, message: "Username is already in use." }, { status: 200 }) : 
    NextResponse.json({ user: null, message: "This account doesn't exist." }, { status: 404 });
}