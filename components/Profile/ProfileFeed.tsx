"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { InfiniteScrollContainer } from "../Feed/InfiniteScrollContainer";
import React from "react";
import { RegularTweet, Retweet } from "@/types/Tweet";
import { Tweet } from "../Tweet/Tweet";
import { useParams } from "next/navigation";
import { MediaGrid } from "../Media/MediaGrid";
import Link from "next/link";
import Image from "next/image";
import { FileType } from "@/generated/prisma/enums";
import { authClient } from "@/lib/auth-client";

export type Feed = "posts" | "replies" | "media" | "likes";

interface ProfileFeedProps {
    type: Feed;
}

const fetchTweets = async (username: string, type: Feed, includeReplies: boolean | undefined, { pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}&includeReplies=${includeReplies}`
        : "";

    const response = await fetch(`/api/posts/user/${username}/${type}?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweets.");
    }
}

const fetchPinnedTweet = async (username: string) => {
    const response = await fetch(`/api/posts/user/${username}/pinned`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch pinned tweet.");
    }
}

export const ProfileFeed = ({ type }: ProfileFeedProps) => {

    const params = useParams();
    const { data: sessionData } = authClient.useSession();
    const username = params.username as string;
    const includeReplies = type === "replies";

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
        queryFn: ({ pageParam }) => fetchTweets(username, type, includeReplies, { pageParam }),
        queryKey: ["profilefeed", type, username, includeReplies],
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
    });

    const { data: pinnedTweetData, isLoading: isPinnedTweetLoading } = useQuery({
        queryFn: () => fetchPinnedTweet(username),
        queryKey: ["pinnedTweet", username],
        enabled: type === "posts" || type === "replies",
    });

    if (!sessionData || !isLoading && data?.pages[0].items.length === 0 && !isPinnedTweetLoading && !pinnedTweetData?.pinnedTweet) {
        return (
            <div className="min-h-screen flex justify-center">
                <div className="flex flex-col space-y-2">
                    <p className="text-3xl font-bold mt-14">@{username} hasn't <br /> posted</p>
                    <p className="text-zinc-500 text-sm">When they do, their posts will show up here.</p>
                </div>
            </div>
        )
    }

    if (type === "media") {
        return (
            <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                <MediaGrid>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: RegularTweet | Retweet) => (
                                <Link href={`/${username}/status/${tweet.id}`} key={tweet.id}>
                                    {tweet.files[0].type === FileType.IMAGE ? (
                                        <Image
                                            alt="Tweet media"
                                            src={tweet.files[0].url}
                                            height={196}
                                            width={196}
                                            className="aspect-square"
                                        />
                                    ) : (
                                        <video
                                            className="w-full h-full object-cover"
                                            src={tweet.files[0].url}
                                            preload="metadata"
                                        />
                                    )}
                                </Link>
                            ))}
                        </React.Fragment>
                    ))}
                </MediaGrid>
                {isFetchingNextPage && <LoadingSpinner />}
            </InfiniteScrollContainer>
        )
    }

    return (
        <div>
            {(type === "posts" || type == "replies") && pinnedTweetData?.pinnedTweet && (
                <Tweet type="tweet" tweet={pinnedTweetData.pinnedTweet} isParentTweet={false} />
            )}
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: RegularTweet | Retweet) => (
                                <React.Fragment key={tweet.id}>
                                    {tweet.parentTweet && <Tweet type="tweet" tweet={tweet.parentTweet} isParentTweet={true} />}
                                    <Tweet type="tweet" tweet={tweet} isParentTweet={false} />
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                    {isFetchingNextPage && <LoadingSpinner />}
                </InfiniteScrollContainer>
            )}
        </div>
    )
}