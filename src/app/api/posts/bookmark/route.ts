import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getBookmarkedTweets } from "@/utils/tweet/tweetUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: Request) {
    const session = await auth();
    const { postId } = await req.json();

    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    try {
        const bookmark = await prisma.posts.findFirst({
            where: {
                ID: postId,
                bookmarks: {
                    some: {
                        UserID: parseInt(session?.user.id)
                    }
                }
            }
        });

        if (bookmark) {
            await prisma.bookmarks.delete({
                where: {
                    UserID_PostID: {
                        UserID: parseInt(session?.user.id),
                        PostID: postId
                    }
                }
            });

            return NextResponse.json({ message: "Tweet unbookmarked successfully. "}, { status: 200 });
        } else {
            await prisma.bookmarks.create({
                data: {
                    PostID: postId,
                    UserID: parseInt(session?.user.id)
                }
            });

            return NextResponse.json({ message: "Tweet bookmarked successfully. "}, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error.", error: error }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const userId = parseInt(session.user.id);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
        const bookmarkedTweets = await getBookmarkedTweets(userId, page, limit);
        return NextResponse.json(bookmarkedTweets, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error.", error: error }, { status: 500 });
    }
}