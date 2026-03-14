import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTweetById } from "@/lib/queries/tweet-queries";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                pinnedTweetId: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.pinnedTweetId) {
            return NextResponse.json({ pinnedTweet: null }, { status: 200 });
        }

        const pinnedTweet = await getTweetById(user.pinnedTweetId);

        return NextResponse.json({ pinnedTweet }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}