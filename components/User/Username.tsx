import Link from "next/link";
import { cn } from "@/lib/utils";

interface UsernameProps {
    username: string;
    styles?: string;
    useLink?: boolean;
}

export const Username = ({ username, styles, useLink = true }: UsernameProps) => {

    const className = cn("block truncate overflow-hidden whitespace-nowrap h-fit text-black text-zinc-500 text-[15px]", styles);

    return useLink ? (
        <Link href={`/${username}`} onClick={(e) => e.stopPropagation()} className="min-w-0">
            <span className={className}>@{username}</span>
        </Link>
    ) : (
        <div className="min-w-0">
            <span className={className}>@{username}</span>
        </div>
    );
}