"use server";

import { storage } from "@/lib/appwrite";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function deleteTweet(tweetId: number) {

    const session = await getSession();

    if (!session) {
        return { error: "Not authenticated." };
    }

    try {
        const tweet = await prisma.tweet.findUnique({
            where: {
                id: tweetId,
                userId: session.user.id
            },
            select: {
                files: true
            }
        });

        if (!tweet) {
            return { success: false, error: "Tweet not found." };
        }

        if (tweet.files.length > 0) {
            for (const file of tweet.files) {
                const fileID = file.url.split("/")[8];
                await storage.deleteFile({
                    bucketId: process.env.APPWRITE_BUCKET_ID!,
                    fileId: fileID
                });
            }
        }

        await prisma.tweet.delete({
            where: {
                id: tweetId,
                userId: session.user.id
            }
        });

        return { success: true, message: "Post deleted successfully." };
    } catch (error) {
        return { success: false, error: "Post deletion failed. Try again later." };
    }
}