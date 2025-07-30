import { auth } from "@/auth";
import { storage } from "@/lib/appwrite";
import { prisma } from "@/lib/prisma";
import { getTweetById, getTweets } from "@/utils/tweet/tweetUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const { text, userID, files, parentTweetID } = await req.json();

    if (!text && files.length === 0) return NextResponse.json({ message: "Tweet cannot be empty." }, { status: 400 });

    try {
        const post = await prisma.posts.create({
            data: {
                UserID: userID,
                Content: text,
                ParentID: parentTweetID
            }
        });

        if (!post) return NextResponse.json({ message: "Something went wrong." }, { status: 500 });

        if (files && files.length > 0) {
            await prisma.files.createMany({
                data: files.map((file: { url: string; type: string; }) => ({
                    PostID: post.ID,
                    File_URL: file.url,
                    File_Type: file.type.split("/")[0],
                })),
            });
        }

        const createdPost = await getTweetById(post.ID);    

        return NextResponse.json({ message: "Tweet posted successfully.", post: createdPost }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error. " }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        
        const posts = await getTweets(page, limit);
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error. " }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const tweetId = searchParams.get("tweetId");

    if (!tweetId) {
        return NextResponse.json({ message: "Tweet ID is required" }, { status: 400 });
    }

    try {
        const tweet = await prisma.posts.findFirst({
            where: {
                ID: parseInt(tweetId),
                UserID: parseInt(session.user.id)
            },
            include: {
                files: true,
            }
        });

        if (!tweet) {
            return NextResponse.json({ message: "Could not find tweet. "}, { status: 404 });
        }

        for (const file of tweet.files) {
            try {
                const fileID = file.File_URL.split("/")[8];
                await storage.deleteFile(process.env.APPWRITE_BUCKET_ID!, fileID);
            } catch (error) {
                console.log(error);
            }
        }

        await prisma.posts.delete({
            where: {
                ID: tweet.ID
            }
        });

        return NextResponse.json({ message: "Tweet deleted successfully. "}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete post. " }, { status: 500 });
    }
}