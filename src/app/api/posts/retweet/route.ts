import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const session = await auth();
    const { postId } = await req.json();

    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    try {
        const retweet = await prisma.retweets.findUnique({
            where: {
                UserID_PostID: {
                    PostID: postId,
                    UserID: parseInt(session.user.id)
                }
            }
        });

        if (retweet) {
            await prisma.retweets.delete({
                where: {
                    UserID_PostID: {
                        PostID: postId,
                        UserID: parseInt(session.user.id)
                    }
                }
            });

            return NextResponse.json({ message: "Post unretweeted successfully." }, { status: 200 });
        } else {
            await prisma.retweets.create({
                data: {
                    PostID: postId,
                    UserID: parseInt(session.user.id)
                }
            });

            return NextResponse.json({ message: "Post retweeted successfully." }, { status: 200 });
        }
    } catch {
        return NextResponse.json({ message: "Internal Server Error. "}, { status: 500 });
    }
}