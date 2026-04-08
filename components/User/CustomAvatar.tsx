"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import defaultPfp from "@/public/defaultPfp.jpg";
import { cn } from "@/lib/utils";
import React from "react";
import { ProfileHoverCard } from "../Profile/ProfileHoverCard";
import { useRouter } from "next/navigation";

export type size = "sm" | "md" | "lg" | "xl" | "2xl";

interface CustomAvatarProps {
    src: string;
    alt: string;
    size: size;
    children?: React.ReactNode;
    username?: string;
    useLink?: boolean;
    useHoverCard?: boolean;
    styles?: string;
}

export const CustomAvatar = ({ src, alt, size, children, username, useLink = true, useHoverCard = true, styles }: CustomAvatarProps) => {

    const router = useRouter();

    const getSize = (size: size) => {
        switch (size) {
            case "sm":
                return "w-8 h-8";
            case "md":
                return "w-10 h-10";
            case "lg":
                return "w-18 h-18";
            case "xl":
                return "w-25 h-25";
            case "2xl":
                return "w-33 h-33";
            default:
                return "w-10 h-10";
        }
    }

    const onAvatarClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        if (useLink) {
            e.stopPropagation();
            router.push(`/${username}`);
        }
    }

    const avatarElement = (
        <Avatar className={cn(getSize(size), "hover:cursor-pointer", styles)} onClick={onAvatarClick}>
            <AvatarImage src={src || defaultPfp.src} alt={alt} className="rounded-full" />
            <AvatarFallback>CN</AvatarFallback>
            {children}
        </Avatar>
    );

    const customAvatar = (
        useHoverCard && useLink ? (
            <ProfileHoverCard username={username ?? ""}>
                {avatarElement}
            </ProfileHoverCard>
        ) : (
            avatarElement
        )
    );

    return customAvatar;
}