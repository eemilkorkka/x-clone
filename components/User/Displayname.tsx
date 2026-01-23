import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileHoverCard } from "../Profile/ProfileHoverCard";

interface DisplaynameProps {
    displayName: string;
    username: string;
    styles?: string;
    useHoverCard?: boolean;
    useLink?: boolean;
}

export const Displayname = ({ displayName, username, styles, useHoverCard = false, useLink = true }: DisplaynameProps) => {

    const className = cn(
        "block truncate overflow-hidden whitespace-nowrap h-fit text-black font-bold text-[15px]",
        useLink && "hover:underline",
        styles
    );

    const displayNameElement = useHoverCard && useLink ? (
        <ProfileHoverCard username={username}>
            <span className={className}>{displayName}</span>
        </ProfileHoverCard>
    ) : (
        <span className={className}>{displayName}</span>
    );

    return useLink ? (
        <Link href={`/${username}`} onClick={(e) => e.stopPropagation()} className="min-w-0">
            {displayNameElement}
        </Link>
    ) : (
        <div>
            {displayNameElement}
        </div>
    );
}