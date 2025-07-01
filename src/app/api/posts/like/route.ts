import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLikedTweets } from "@/utils/tweet/tweetUtils";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

        const { postId } = await req.json();

        const like = await prisma.likes.findUnique({
            where: {
                UserID_PostID: {
                    PostID: postId,
                    UserID: parseInt(session.user.id),
                },
            },
        });

        if (like) {
            await prisma.likes.delete({
                where: {
                    UserID_PostID: {
                        PostID: postId,
                        UserID: parseInt(session.user.id),
                    },
                },
            });

            return NextResponse.json({ message: "Post unliked successfully." }, { status: 200 });
        } else {
            await prisma.likes.create({
                data: {
                    PostID: postId,
                    UserID: parseInt(session.user.id),
                },
            });

            return NextResponse.json({ message: "Post liked successfully." }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error.", error: error }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const userId = parseInt(searchParams.get("userId") || "");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        const likedPosts = await getLikedTweets(userId, page, limit);
        return NextResponse.json(likedPosts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 });
    }
}