"use client";

import { cn } from "@/lib/utils";
import { ProfileHoverCard } from "../Profile/ProfileHoverCard";
import { useRouter } from "next/navigation";

interface DisplaynameProps {
    displayName: string;
    username: string;
    styles?: string;
    useHoverCard?: boolean;
    useLink?: boolean;
}

export const Displayname = ({ displayName, username, styles, useHoverCard = false, useLink = true }: DisplaynameProps) => {

    const router = useRouter();

    const className = cn(
        "block truncate overflow-hidden whitespace-nowrap text-left h-fit font-bold text-[15px]",
        useLink && "hover:underline cursor-pointer",
        styles
    );

    const onDisplaynameClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        router.push(`/${username}`);
    }

    const displayNameElement = useHoverCard && useLink ? (
        <ProfileHoverCard username={username}>
            <span className={className} onClick={onDisplaynameClick}>{displayName}</span>
        </ProfileHoverCard>
    ) : (
        <span className={className}>{displayName}</span>
    );

    return displayNameElement;
}