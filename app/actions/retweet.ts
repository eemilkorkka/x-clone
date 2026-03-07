
"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function retweet(formData: FormData) {
    const postId = formData.get("postId");
    const session = await getSession();

    if (!session || !session.user) return { success: false, error: "Not authenticated." };

    const tweetToRetweet = await prisma.tweet.findUnique({
        where: { 
            id: parseInt(postId as string) 
        }
    });

    if (!tweetToRetweet) return { success: false, error: "Tweet not found." };

    const originalTweetId = tweetToRetweet.isRetweet
        ? tweetToRetweet.originalTweetId
        : tweetToRetweet.id;

    const hasRetweeted = await prisma.tweet.findFirst({
        where: {
            isRetweet: true,
            userId: session.user.id,
            originalTweetId: originalTweetId
        }
    });

    try {
        if (!hasRetweeted) {
            await prisma.tweet.create({
                data: {
                    isRetweet: true,
                    userId: session.user.id,
                    originalTweetId: originalTweetId!
                }
            });

            return { success: true, message: "Tweet retweeted successfully." };
        } else {
            await prisma.tweet.delete({
                where: { id: hasRetweeted.id }
            });

            return { success: true, message: "Retweet removed successfully." };
        }
    } catch (error) {
        return { success: false, error: hasRetweeted ? "Failed to unretweet." : "Failed to retweet." };
    }
}