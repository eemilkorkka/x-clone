import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface DisplaynameProps {
    displayName: string;
    username: string;
    styles?: string;
    useHoverCard?: boolean;
    useLink?: boolean;
}

export const Displayname = ({ displayName, username, styles, useHoverCard = false, useLink = true }: DisplaynameProps) => {

    const className = twMerge(`block truncate overflow-hidden whitespace-nowrap text-black text-black font-bold text-[15px] ${useLink && "hover:underline"}`, styles);

    return useLink ? (
        <Link href={`/${username}`} onClick={(e) => e.stopPropagation()} className="min-w-0">
            <span className={className}>{displayName}</span>
        </Link>
    ) : (
        <div className={className}>
            <span className={className}>{displayName}</span>
        </div>
    );
}