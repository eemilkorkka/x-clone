import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ui/ReturnBack";
import { TweetView } from "@/components/Tweet/TweetView";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getTweetById } from "@/lib/queries/tweet-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ username: string, id: string }> }) {
    const { username, id } = await params;

    const post = await prisma.tweet.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            user: {
                select: {
                    displayUsername: true,
                }
            },
            tweetContent: true
        }
    });

    if (!post) {
        return { title: "", description: "Post not found" };
    }

    return {
        title: `${post.user.displayUsername} on X Clone: "${post.tweetContent}"`,
        description: `View the post by @${username} on X Clone.`,
    }
}

export default async function TweetPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    const tweetId = parseInt(id);
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryFn: () => getTweetById(tweetId),
        queryKey: ["tweet", tweetId]
    });

    return (
        <>
            <FeedHeader styles="border-b-0">
                <ReturnBack />
                <p className="font-bold text-xl">Post</p>
            </FeedHeader>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TweetView id={tweetId} />
            </HydrationBoundary>
        </>
    )
}