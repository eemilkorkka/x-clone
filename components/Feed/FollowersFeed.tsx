"use client";

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { InfiniteScrollContainer } from "./InfiniteScrollContainer"
import { LoadingSpinner } from "../ui/LoadingSpinner";
import React from "react";
import { User } from "../User/User";
import { FollowButton } from "../User/FollowButton";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../ui/Icon";
import { BsThreeDots } from "react-icons/bs";
import { UserWithFollowData } from "@/types/User";
import { IoPersonRemove } from "react-icons/io5";
import { OptionsPopover } from "../Tweet/TweetPopover/OptionsPopover";
import { RemoveFollowerDialog } from "../User/RemoveFollowerDialog";
import { removeFollower } from "@/app/actions/removeFollower";
import { getQueryClient } from "@/lib/getQueryClient";
import { useToastMessage } from "@/hooks/useToastMessage";

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
    const queryClient = getQueryClient();
    const { toastMessage } = useToastMessage();
    
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

    const removeFollowerMutation = useMutation({
        mutationFn: (followerId: string) => removeFollower(followerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followers', sessionData?.user.username] });
            queryClient.invalidateQueries({ queryKey: ["user", sessionData?.user.username] })
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "Failed to remove follower.", false);
        }
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
                                            {user.id !== sessionData?.user.id && (
                                                <FollowButton
                                                    username={user.username ?? ""}
                                                    userId={user.id}
                                                    isFollowing={isFollowing}
                                                />
                                            )}
                                            {username === sessionData?.user.username && (
                                                <OptionsPopover options={[
                                                    {
                                                        label: "Remove this follower",
                                                        icon: <IoPersonRemove />,
                                                        popoverOption: <RemoveFollowerDialog
                                                            key={user.id}
                                                            username={user.username ?? ""}
                                                            onConfirmClick={() => removeFollowerMutation.mutate(user.id)}
                                                        />
                                                    }
                                                ]}>
                                                    <Icon styles="text-zinc-500">
                                                        <BsThreeDots />
                                                    </Icon>
                                                </OptionsPopover>
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