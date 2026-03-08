"use client";

import { cn } from "@/lib/utils";
import { ProfileHoverCard } from "../Profile/ProfileHoverCard";
import React from "react";
import { useRouter } from "next/navigation";

interface UsernameProps {
    username: string;
    styles?: string;
    useLink?: boolean;
    useHoverCard?: boolean;
}

export const Username = ({ username, styles, useLink = true, useHoverCard = true }: UsernameProps) => {

    const router = useRouter();
    const className = cn("block truncate overflow-hidden whitespace-nowrap h-fit text-zinc-500 text-[15px]", styles);

    const onUsernameClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        router.push(`/${username}`);
    }

    const usernameElement = useLink && useHoverCard ? (
        <ProfileHoverCard username={username}>
            <span className={className} onClick={onUsernameClick}>@{username}</span>
        </ProfileHoverCard>
    ) : (
        <span className={className}>@{username}</span>
    );

    return usernameElement;
}