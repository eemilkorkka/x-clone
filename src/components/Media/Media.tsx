"use client";
import Image from "next/image";
import { ReactNode } from "react";
import MediaViewDialog from "./MediaViewDialog";
import { usePathname } from "next/navigation";

interface MediaProps {
    type: string;
    url: string;
    children?: ReactNode;
}

const Media = ({ type, url, children }: MediaProps) => {
    const pathname = usePathname();

    const imageElement = (
        <div className="w-full h-full">
            {type.startsWith("image") ? (
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
                    preload="metadata"
                />
            )}
            {children}
        </div>
    )

    return (
        <>
            {pathname.includes("media") ? (
                imageElement
            ) : (
                <MediaViewDialog type={type} url={url}>
                    {imageElement}
                </MediaViewDialog>
            )}
        </>
    );
}

export default Media;