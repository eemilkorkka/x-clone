import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface UsernameProps {
    username: string;
    styles?: string;
    useHoverCard?: boolean;
    useLink?: boolean;
}

export const Username = ({ username, styles, useHoverCard = false, useLink = true }: UsernameProps) => {

    const className = twMerge("text-black text-zinc-500 text-sm", styles);

    return useLink ? (
        <Link href={`/${username}`}>
            <span className={className}>@{username}</span>
        </Link>
    ) : (
        <div className="">
            <span className={className}>@{username}</span>
        </div>
    );
}