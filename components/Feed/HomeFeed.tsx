"use client";

import { TweetForm } from "../Tweet/TweetForm";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Tweet } from "../Tweet/Tweet";
import { RegularTweet, Retweet } from "@/types/Tweet";
import { InfiniteScrollContainer } from "./InfiniteScrollContainer";
import { LoadingSpinner } from "../LoadingSpinner";
import { useQueryState } from 'nuqs';
import { authClient } from "@/lib/auth-client";
import { HomeHeader } from "../Home/HomeHeader";
import { cn } from "@/lib/utils";

const tabs = [
    { label: "For you" },
    { label: "Following" }
];

const fetchTweets = async (feed: string | null, { pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}`
        : "";

    const response = await fetch(feed === "foryou" ? `/api/posts?${query}` : `/api/posts/following?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweets.");
    }
}

export const HomeFeed = () => {

    const { data: sessionData } = authClient.useSession();
    const [feed, setFeed] = useQueryState("feed", {
        defaultValue: "foryou"
    });

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
        queryFn: ({ pageParam }) => fetchTweets(feed, { pageParam }),
        queryKey: ["tweets", sessionData?.user.id, feed],
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
    });

    return (
        <>
            <HomeHeader setFeed={setFeed} />
            <TweetForm type="tweet" isComposeModal={false} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: RegularTweet | Retweet) => (
                                <Tweet type="tweet" key={tweet.id} tweet={tweet} isParentTweet={false} />
                            ))}
                        </React.Fragment>
                    ))}
                    {isFetchingNextPage && <LoadingSpinner />}
                </InfiniteScrollContainer>
            )}
        </>
    )
}