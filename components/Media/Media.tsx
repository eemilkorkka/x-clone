import React from "react";
import Image from 'next/image';
import { FileType } from "@/generated/prisma/enums";
import { MediaDialog } from "./MediaDialog";

interface MediaProps {
    type: FileType;
    url: string;
    children?: React.ReactNode;
    useDialog?: boolean;
}

export const Media = ({ type, url, children, useDialog = true }: MediaProps) => {

    const image = (
        <Image
            className="w-full h-full cursor-pointer object-cover"
            src={url}
            alt="Media"
            unoptimized
            width={0}
            height={0}
        />
    );

    const imageElement = (
        <div className="relative w-full h-full">
            {type === FileType.IMAGE ? (
                useDialog ? (
                    <MediaDialog src={url}>
                        {image}
                    </MediaDialog>
                ) : (
                    image
                )
            ) : (
                <video
                    className="w-full h-full cursor-pointer object-cover"
                    src={url}
                    controls
                    autoPlay
                    playsInline
                    loop
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