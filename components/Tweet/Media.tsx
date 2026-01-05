import React from "react";
import Image from 'next/image';
import { FileType } from "@/generated/prisma/enums";

interface MediaProps {
    type: FileType;
    url: string;
    children?: React.ReactNode;
}

export const Media = ({ type, url, children }: MediaProps) => {
    const imageElement = (
        <div className="relative w-full h-full">
            {type === FileType.IMAGE ? (
                <Image
                    className="w-full h-full cursor-pointer object-cover"
                    src={url}
                    alt="Uploaded media"
                    unoptimized
                    width={0}
                    height={0}
                />
            ) : (
                <video
                    className="w-full h-full cursor-pointer object-cover"
                    src={url}
                    controls
                    autoPlay
                    playsInline
                    muted
                    onClick={(e) => e.stopPropagation()}
                    preload="metadata"
                />
            )}
            {children}
        </div>
    );

    return (
        imageElement
    )
}