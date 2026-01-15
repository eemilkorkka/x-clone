"use client";

import { authClient } from "@/lib/auth-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollContainer } from "./InfiniteScrollContainer";
import React from "react";
import { Tweet } from "./Tweet/Tweet";
import { Tweet as TweetType } from "@/types/Tweet";
import { LoadingSpinner } from "./LoadingSpinner";

const fetchBookmarks = async (username: string, { pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}`
        : "";

    const response = await fetch(`/api/posts/user/${username}/bookmarks?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweets.");
    }
}

export const BookmarksFeed = () => {

    const { data: sessionData } = authClient.useSession();

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
        queryFn: ({ pageParam }) => fetchBookmarks(sessionData?.user.username ?? "", { pageParam }),
        queryKey: ["bookmarks", sessionData?.user.username],
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
        enabled: !!sessionData,
    });

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: TweetType) => (
                                <Tweet type="tweet" key={tweet.id} tweet={tweet} isParentTweet={false} />
                            ))}
                        </React.Fragment>
                    ))}
                    {isFetchingNextPage && <LoadingSpinner />}
                </InfiniteScrollContainer >
            )}
        </>
    )
}