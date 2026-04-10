"use client";

import { cn } from "@/lib/utils";
import { ProfileHoverCard } from "../Profile/ProfileHoverCard";
import { useRouter } from "next/navigation";
import { RiVerifiedBadgeFill } from "react-icons/ri";

interface DisplaynameProps {
    displayName: string;
    username: string;
    isVerified?: boolean;
    styles?: string;
    useHoverCard?: boolean;
    useLink?: boolean;
}

export const Displayname = ({ displayName, username, isVerified, styles, useHoverCard = false, useLink = true }: DisplaynameProps) => {

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

    const displayNameElement = (
        <div className="flex items-center">
            <span className={className} onClick={useLink ? (e) => onDisplaynameClick(e) : undefined}>
                {displayName}
            </span>
            {isVerified && <RiVerifiedBadgeFill className="text-sky-500" size={19} />}
        </div>
    )

    const displayNameElementWrapper = useHoverCard && useLink ? (
        <ProfileHoverCard username={username}>
            {displayNameElement}
        </ProfileHoverCard>
    ) : (
        displayNameElement
    );

    return displayNameElementWrapper;
}