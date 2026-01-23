import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileHoverCard } from "../Profile/ProfileHoverCard";

interface UsernameProps {
    username: string;
    styles?: string;
    useLink?: boolean;
    useHoverCard?: boolean;
}

export const Username = ({ username, styles, useLink = true, useHoverCard = true }: UsernameProps) => {

    const className = cn("block truncate overflow-hidden whitespace-nowrap h-fit text-black text-zinc-500 text-[15px]", styles);

    const usernameElement = useLink && useHoverCard ? (
        <ProfileHoverCard username={username}>
            <span className={className}>@{username}</span>
        </ProfileHoverCard>
    ) : (
        <span className={className}>@{username}</span>
    );

    return useLink ? (
        <Link href={`/${username}`} onClick={(e) => e.stopPropagation()} className="min-w-0">
            {usernameElement}
        </Link>
    ) : (
        <div className="min-w-0">
            {usernameElement}
        </div>
    );
}