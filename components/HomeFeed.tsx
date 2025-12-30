"use client";

import { useState } from "react";
import { FeedHeader } from "./FeedHeader"
import { Tabs } from "./Tabs"
import { TweetForm } from "./Tweet/TweetForm";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Tweet } from "./Tweet/Tweet";
import { RegularTweet, Retweet } from "@/types/Tweet";

const tabs = [
    { label: "For you" },
    { label: "Following" }
];

const fetchTweets = async ({ pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}`
        : "";

    const response = await fetch(`/api/posts?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweets.");
    }
}

export const HomeFeed = () => {

    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryFn: ({ pageParam }) => fetchTweets({ pageParam }),
        queryKey: ["tweets"],
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
    });

    return (
        <>
            <FeedHeader>
                <Tabs tabs={tabs} activeTab={activeTab} changeTab={setActiveTab} />
            </FeedHeader>
            <TweetForm type="tweet" isComposeModal={false} />
            <div>
                {data && data?.pages.map((group, i) => (
                    <React.Fragment key={i}>
                        {group.items?.map((tweet: RegularTweet | Retweet) => (
                            <Tweet type="tweet" key={tweet.id} tweet={tweet} isParentTweet={false} />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}