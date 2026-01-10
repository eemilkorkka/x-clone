import React from "react";
import Image from 'next/image';
import { FileType } from "@/generated/prisma/enums";
import { MediaDialog } from "./MediaDialog";

interface MediaProps {
    type: FileType;
    url: string;
    children?: React.ReactNode;
}

export const Media = ({ type, url, children }: MediaProps) => {
    const imageElement = (
        <div className="relative w-full h-full">
            {type === FileType.IMAGE ? (
                <MediaDialog src={url}>
                    <Image
                        className="w-full h-full cursor-pointer object-cover"
                        src={url}
                        alt="Media"
                        unoptimized
                        width={0}
                        height={0}
                    />
                </MediaDialog>
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