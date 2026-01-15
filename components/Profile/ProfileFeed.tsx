"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../LoadingSpinner";
import { InfiniteScrollContainer } from "../InfiniteScrollContainer";
import React from "react";
import { RegularTweet, Retweet } from "@/types/Tweet";
import { Tweet } from "../Tweet/Tweet";
import { useParams } from "next/navigation";
import { MediaGrid } from "../Media/MediaGrid";
import Link from "next/link";
import Image from "next/image";
import { FileType } from "@/generated/prisma/enums";

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

export const ProfileFeed = ({ type }: ProfileFeedProps) => {

    const params = useParams();
    const username = params.username as string;
    const includeReplies = type === "replies" ? true : false;

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

    if (type === "media") {
        return (
            <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                <MediaGrid>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: RegularTweet | Retweet,) => (
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
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((tweet: RegularTweet | Retweet,) => (
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
        </>
    )
}