import Image from "next/image";
import { ReactNode } from "react";

interface AttachmentProps {
    type: string;
    url: string;
    children?: ReactNode;
}

const Media = ({ type, url, children }: AttachmentProps) => {
    return (
        <>
            {type.startsWith("image") ? (
                <Image
                    className="w-full h-full rounded-xl cursor-pointer object-cover"
                    src={url}
                    alt="Uploaded media"
                    unoptimized
                    width={0}
                    height={0}
                />
                ) : (
                <video
                    className="w-full h-full rounded-xl cursor-pointer object-cover"
                    src={url}
                    controls
                />
            )}
            {children}
        </>
    );
}

export default Media;