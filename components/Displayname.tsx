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

    const className = twMerge("text-black text-black font-bold text-sm hover:underline", styles);

    return useLink ? (
        <Link href={`/${username}`}>
            <span className={className}>{displayName}</span>
        </Link>
    ) : (
        <div className="">
            <span className={className}>{displayName}</span>
        </div>
    );
}