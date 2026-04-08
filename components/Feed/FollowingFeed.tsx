"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollContainer } from "./InfiniteScrollContainer"
import { LoadingSpinner } from "../ui/LoadingSpinner";
import React from "react";
import { User } from "../User/User";
import { FollowButton } from "../User/FollowButton";
import { authClient } from "@/lib/auth-client";
import { UserWithFollowData } from "@/types/User";

const fetchFollowing = async (username: string, { pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}`
        : "";

    const response = await fetch(`/api/users/${username}/following?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch followers.");
    }
}

export const FollowingFeed = ({ username }: { username: string }) => {

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
        queryFn: ({ pageParam }) => fetchFollowing(username, { pageParam }),
        queryKey: ["following", username],
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
    });

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                    {data && data?.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group.items?.map((user: UserWithFollowData) => {

                                const isFollowing = user.followers.some(follower => follower.followerId === sessionData?.user.id);

                                return (
                                    <User key={user.id} user={user} showBio={true} showFollowBadge={true}>
                                        <div className="flex gap-1">
                                            {sessionData?.user.username !== user.username && (
                                                <FollowButton
                                                    username={user.username ?? ""}
                                                    userId={user.id}
                                                    isFollowing={isFollowing}
                                                />
                                            )}
                                        </div>
                                    </User>
                                )
                            })}
                        </React.Fragment>
                    ))}
                    {isFetchingNextPage && <LoadingSpinner />}
                </InfiniteScrollContainer>
            )}
        </>
    )
}