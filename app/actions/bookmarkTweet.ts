"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function bookmarkTweet(formData: FormData) {
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

    const hasBookmarked = await prisma.bookmark.findUnique({
        where: {
            userId_tweetId: {
                userId: session.user.id,
                tweetId: tweetIdToLike,
            }
        }
    });

    try {
        if (!hasBookmarked) {
            await prisma.bookmark.create({
                data: {
                    userId: session.user.id,
                    tweetId: tweetIdToLike,
                }
            });
            return { message: "Tweet bookmarked successfully." };
        } else {
            await prisma.bookmark.delete({
                where: {
                    userId_tweetId: {
                        userId: session.user.id,
                        tweetId: tweetIdToLike,
                    }
                }
            });
            return { message: "Tweet unbookmarked successfully." };
        }
    } catch (error) {
        return { error: hasBookmarked ? "Failed to unbookmark tweet." : "Failed to bookmark tweet." };
    }
}