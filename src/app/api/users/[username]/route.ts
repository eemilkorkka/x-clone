import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.users.findFirst({
        where: {
            Username: username
        },
        select: {
            UserID: true,
            Username: true,
            DisplayName: true,
            Website: true,
            Location: true,
            ProfilePicture: true,
            CoverPicture: true,
            Bio: true,
            followers: true,
            following: true,
        }
    });

    return user ? NextResponse.json({ user: user, message: "Username is already in use." }, { status: 200 }) : 
    NextResponse.json({ user: null, message: "This account doesn't exist." }, { status: 404 });
}