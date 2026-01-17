"use client";

import { CustomAvatar } from "./CustomAvatar";
import { Username } from "./Username";
import { Displayname } from "./Displayname";
import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Text } from "../Text";
import { UserWithFollowers } from "@/types/Follower";
import { authClient } from "@/lib/auth-client";
import { UserBase } from "@/types/User";
import { Badge } from "../ui/badge";

interface UserProps {
    useLink?: boolean;
    user?: UserWithFollowers | UserBase | null;
    children?: React.ReactNode;
    styles?: string;
    contentStyles?: string;
    showBio?: boolean;
    showFollowBadge?: boolean;
}

export const User = (
    {
        useLink = true,
        user,
        children,
        styles,
        contentStyles,
        showBio = false,
        showFollowBadge = false,
    }: UserProps) => {

    if (!user || !user?.username) return null;

    const router = useRouter();
    const { data } = authClient.useSession();

    const isFollowing = typeof (user) === "object" && "following" in user &&
        user.following?.some(follower => follower.followingId === data?.user.id);

    const userElement = (
        <>
            <CustomAvatar
                src={user.image ?? ""}
                size="md"
                alt={`@${user.username}`}
                username={user.username}
                styles="mr-4"
            />
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className={cn("flex w-full items-start flex-col", contentStyles)}>
                        <Displayname username={user.username ?? ""} displayName={user.displayUsername ?? ""} useLink={useLink} />
                        <div className="flex items-center gap-2">
                            <Username username={user.username ?? ""} useLink={useLink} />
                            {showFollowBadge && isFollowing && <Badge variant="secondary" className="text-gray-500">Follows you</Badge>}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        {children}
                    </div>
                </div>
                {showBio && user.bio && <Text text={user.bio} styles="max-w-sm" />}
            </div>
        </>
    );

    const className = cn("flex hover:bg-ring/20 w-full p-2 hover:cursor-pointer", styles);

    return (
        <div className={className} onMouseDown={(e) => {
            if (e.button === 0 && useLink) {
                router.push(`/${user.username}`);
            }
        }}>
            {userElement}
        </div>
    )
}