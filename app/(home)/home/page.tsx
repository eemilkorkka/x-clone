import { HomeFeed } from "@/components/Feed/HomeFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { getTweets, getTweetsFromFollowing } from "@/lib/queries/tweet-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function HomePage({ 
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    const feed = (await searchParams).variant ?? "foryou";

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => feed === "foryou" ? getTweets() : getTweetsFromFollowing(session.user.id),
        queryKey: ["tweets", session.user.id, feed],
        initialPageParam: undefined,
    });

    return (
        <div className="min-h-screen">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <HomeFeed userId={session.user.id} />
            </HydrationBoundary>
        </div>
    )
}
