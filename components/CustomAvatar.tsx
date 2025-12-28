import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import defaultPfp from "@/public/defaultPfp.jpg";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export type size = "sm" | "md";

interface CustomAvatarProps {
    src: string;
    alt: string;
    size: size;
    username?: string;
    useLink?: boolean;
    useHoverCard?: boolean;
    styles?: string;
}

export const CustomAvatar = ({ src, alt, size, username, useLink = true, useHoverCard = false, styles }: CustomAvatarProps) => {

    const getSize = (size: size) => {
        switch (size) {
            case "sm":
                return "w-8 h-8";
            case "md":
                return "w-10 h-10";
            default:
                return "w-10 h-10";
        }
    }

    const avatarElement = (
        <Avatar className={twMerge(`${getSize(size)} hover:cursor-pointer`, styles)}>
            <AvatarImage src={src || defaultPfp.src} alt={alt} className="rounded-full" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )

    return useLink ? (
        <Link href={`/${username}`}>
            {avatarElement}
        </Link>
    ) : (
        avatarElement
    )
}