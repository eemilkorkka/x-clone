"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollContainer } from "./InfiniteScrollContainer"
import { LoadingSpinner } from "../LoadingSpinner";
import React from "react";
import { User } from "../User/User";
import { UserWithFollowers } from "@/types/Follower";
import { FollowButton } from "../User/FollowButton";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../Icon";
import { BsThreeDots } from "react-icons/bs";

const fetchFollowers = async (username: string, { pageParam }: { pageParam?: { createdAt: string; id: number; } }) => {
    const query = pageParam
        ? `cursorCreatedAt=${encodeURIComponent(pageParam.createdAt)}&cursorId=${pageParam.id}`
        : "";

    const response = await fetch(`/api/users/${username}/followers?${query}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch followers.");
    }
}

export const FollowersFeed = ({ username }: { username: string }) => {

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
        queryFn: ({ pageParam }) => fetchFollowers(username, { pageParam }),
        queryKey: ["followers", username],
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
                            {group.items?.map((user: UserWithFollowers) => {

                                const isFollowing = user.followers.some(follower => follower.followerId === sessionData?.user.id);

                                return (
                                    <User key={user.id} user={user} showBio={true} showFollowBadge={true}>
                                        <div className="flex gap-1">
                                            <FollowButton
                                                username={user.username ?? ""}
                                                userId={user.id}
                                                isFollowing={isFollowing}
                                            />
                                            <Icon styles="text-zinc-500">
                                                <BsThreeDots />
                                            </Icon>
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