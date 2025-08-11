import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const user = await prisma.users.findUnique({
        where: {
            Username: username
        },
        select: {
            UserID: true
        }
    });

    if (user) {
        try {
            const followers = await prisma.users.findMany({
                where: {
                    following: {
                        some: {
                            followingId: user.UserID
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return followers ? NextResponse.json( followers, { status: 200 }) : NextResponse.json({ message: "No followers found." }, { status: 404 });
        } catch (error) {
            return NextResponse.json({ error: error, message: "Internal Server Error." }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
}