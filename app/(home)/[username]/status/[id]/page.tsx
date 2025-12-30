import { FeedHeader } from "@/components/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { TweetView } from "@/components/Tweet/TweetView";
import { getQueryClient } from "@/lib/getQueryClient";
import { getTweetById } from "@/lib/queries/tweet-queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function TweetPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const tweetId = parseInt(id);

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryFn: () => getTweetById(tweetId),
        queryKey: ["tweet", tweetId]
    });

    return (
        <>
            <FeedHeader styles="px-4 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <p className="font-bold text-xl">Post</p>
            </FeedHeader>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TweetView id={tweetId} />
            </HydrationBoundary>
        </>
    )
}