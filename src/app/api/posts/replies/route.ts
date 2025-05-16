import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const tweetId = searchParams.get("tweetId");

    try {
        const replies = await prisma.posts.findMany({
            where: {
                ParentID: parseInt(tweetId!)
            },
            include: {
                users: {
                    select: {
                        Username: true,
                        DisplayName: true,
                        ProfilePicture: true,
                    },
                },
                files: true,
                likes: {
                    select: {
                        UserID: true,
                    },
                },
                replies: {
                    select: {
                        UserID: true,
                    }
                }
            },
        });

        return NextResponse.json(replies, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error. " }, { status: 500 });
    }
}