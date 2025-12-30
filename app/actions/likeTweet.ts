"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function likeTweet(formData: FormData) {
    const postId = formData.get("postId");
    const session = await getSession();

    if (!session || !session.user) return { error: "Not authenticated." };

    const tweet = await prisma.tweet.findUnique({
        where: { 
            id: parseInt(postId as string) 
        }
    });

    if (!tweet) return { error: "Tweet not found." };

    const tweetIdToLike = tweet.isRetweet ? tweet.originalTweetId! : tweet.id;

    const hasLiked = await prisma.like.findUnique({
        where: {
            userId_tweetId: {
                userId: session.user.id,
                tweetId: tweetIdToLike,
            }
        }
    });

    try {
        if (!hasLiked) {
            await prisma.like.create({
                data: {
                    userId: session.user.id,
                    tweetId: tweetIdToLike,
                }
            });
            return { message: "Tweet liked successfully." };
        } else {
            await prisma.like.delete({
                where: {
                    userId_tweetId: {
                        userId: session.user.id,
                        tweetId: tweetIdToLike,
                    }
                }
            });
            return { message: "Tweet unliked successfully." };
        }
    } catch (error) {
        return { error: hasLiked ? "Failed to unlike tweet." : "Failed to like tweet." };
    }
}