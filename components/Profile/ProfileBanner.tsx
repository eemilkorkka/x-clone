import React from "react";
import Image from "next/image";

interface ProfileBannerProps {
    children?: React.ReactNode;
    src: string;
}

export const ProfileBanner = ({ children, src }: ProfileBannerProps) => {
    return (
        <div className={`relative w-full aspect-[3/1] max-h-50 ${!src && "bg-gray-300"}`}>
            {src && (
                <Image
                    src={src}
                    alt="profile banner"
                    fill
                />
            )}
            {children}
        </div>
    )
}