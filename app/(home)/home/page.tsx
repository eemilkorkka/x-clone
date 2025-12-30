import { HomeFeed } from "@/components/HomeFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { getTweets } from "@/lib/queries/tweet-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function HomePage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getTweets(),
        queryKey: ["tweets"],
        initialPageParam: undefined,
    });

    return (
        <div className="h-screen">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <HomeFeed />
            </HydrationBoundary>
        </div>
    )
}
