"use client";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import { CustomAvatar } from "../User/CustomAvatar";
import { useGetUserData } from "@/hooks/useGetUserData";
import { FollowButton } from "../User/FollowButton";
import { authClient } from "@/lib/auth-client";
import { Follower } from "@/types/Follower";
import { Displayname } from "../User/Displayname";
import { Username } from "../User/Username";
import { Text } from "../ui/Text";
import Link from "next/link";
import { useState } from "react";

interface ProfileHoverCardProps {
    children: React.ReactNode;
    username: string;
}

export const ProfileHoverCard = ({ children, username }: ProfileHoverCardProps) => {

    const { data: sessionData } = authClient.useSession();
    const [open, setOpen] = useState(false);
    const { data } = useGetUserData(username, open);
    const isFollowing = data?.followers.some((follower: Follower) => follower.followerId === sessionData?.user.id);

    return (
        <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger>
                {children}
            </HoverCardTrigger>
            {data && (
                <HoverCardContent className="flex bg-background flex-col gap-2 min-w-[300px] max-w-[300px] w-full">
                    <div className="flex justify-between">
                        <CustomAvatar
                            src={data.image ?? ""}
                            username={data.username}
                            alt={``}
                            size="lg"
                            useHoverCard={false}
                        />
                        {sessionData?.user.id !== data.id && (
                            <FollowButton
                                userId={data.id}
                                username={username}
                                isFollowing={isFollowing}
                            />
                        )}
                    </div>
                    <div>
                        <Displayname username={username} displayName={data.displayUsername} styles="text-lg" />
                        <Username username={username} />
                    </div>
                    <Text text={data.bio} />
                    <div className="flex gap-8 text-sm">
                        <Link href={`/${data.username}/following`} className="hover:underline">
                            <span className="font-semibold">
                                {data.following.length}
                                {' '}
                                <span className="text-zinc-500 font-normal">Following</span>
                            </span>
                        </Link>
                        <Link href={`/${data.username}/followers`} className="hover:underline">
                            <span className="font-semibold">
                                {data.followers.length}
                                {' '}
                                <span className="text-zinc-500 font-normal">{data.followers.length === 1 ? "Follower" : "Followers"}</span>
                            </span>
                        </Link>
                    </div>
                </HoverCardContent>
            )}
        </HoverCard>
    )
}