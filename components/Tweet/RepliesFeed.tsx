import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollContainer } from "../InfiniteScrollContainer"
import React from "react";
import { Tweet } from "./Tweet";
import { ReplyTweet } from "@/types/Tweet";
import { Spinner } from "../ui/spinner";

const fetchReplies = async (id: number, { pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}`
        : "";

    const response = await fetch(`/api/posts/${id}/replies?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweets.");
    }
}

export const RepliesFeed = ({ parentTweetId }: { parentTweetId: number }) => {

    const {
        data,
        error,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryFn: ({ pageParam }) => fetchReplies(parentTweetId, { pageParam }),
        queryKey: ["replies", parentTweetId],
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
    });

    return (
        <>
            {isLoading ? (
                isFetchingNextPage && <Spinner className="flex w-full text-sky-500 h-8" />
            ) : (
                <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: ReplyTweet) => (
                                <Tweet type="tweet" key={tweet.id} tweet={tweet} isParentTweet={false} />
                            ))}
                        </React.Fragment>
                    ))}
                    {isFetchingNextPage && <Spinner className="flex w-full text-sky-500 h-8" />}
                </InfiniteScrollContainer>
            )}
        </>
    )
}