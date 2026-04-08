import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MediaDialog } from "../Media/MediaDialog";

interface ProfileBannerProps {
    children?: React.ReactNode;
    src: string;
    isPreview?: boolean;
    styles?: string;
}

export const ProfileBanner = ({ children, src, isPreview = false, styles }: ProfileBannerProps) => {

    const ImageElement = (
        <Image
            src={src}
            alt="profile banner"
            className={cn("hover:cursor-pointer", styles)}
            fill
            preload
        />
    );

    return (
        <div className={cn("relative w-full aspect-[3/1]", !src && "bg-gray-300")}>
            {src && (
                <>
                    {!isPreview ? (
                        <MediaDialog src={src}>
                            {ImageElement}
                        </MediaDialog>
                    ) : (
                        ImageElement
                    )}
                </>
            )}
            {children}
        </div>
    )
}