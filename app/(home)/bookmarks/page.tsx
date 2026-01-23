import { BookmarksFeed } from "@/components/Feed/BookmarksFeed";
import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { getQueryClient } from "@/lib/getQueryClient";
import { getBookmarksByUser } from "@/lib/queries/tweet-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Bookmarks"
}

export default async function BookmarksPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getBookmarksByUser(session.user.username ?? ""),
        queryKey: ["bookmarks", session?.user.username],
        initialPageParam: undefined
    });

    return (
        <div>
            <FeedHeader styles="flex px-2 items-center gap-6">
                <ReturnBack />
                <h1 className="text-lg font-bold">Bookmarks</h1>
            </FeedHeader>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <BookmarksFeed />
            </HydrationBoundary>
        </div>
    )
}