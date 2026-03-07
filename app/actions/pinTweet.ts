"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Tweet } from "@/types/Tweet";

export async function pinTweet(tweet: Tweet) {

    const session = await getSession();

    if (!session) {
        return { success: false, error: "Not authenticated." };
    }

    const tweetId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;

    if (tweet.userId != session.user.id) {
        return { success: false, error: "You are not the owner of this tweet." };
    }

    const currentPinnedTweet = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            pinnedTweetId: true
        }
    });

    try {
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                pinnedTweetId: currentPinnedTweet?.pinnedTweetId === tweetId ? null : tweetId
            }
        });

        return { success: true, message: currentPinnedTweet?.pinnedTweetId == tweetId ? "Tweet unpinned successfully." : "Tweet pinned successfully." };
    } catch (error) {
        return { success: false, error: "Internal Server Error." };
    }
}