import Image from "next/image";
import { ReactNode } from "react";
import MediaViewDialog from "../Media/MediaViewDialog";

interface ProfileBannerProps {
    image?: string;
    children?: ReactNode;
}

const ProfileBanner = ({ image, children }: ProfileBannerProps) => {
    return (
        <div className="w-full h-[200px] max-h-[200px] relative">
            {image ? (
                <MediaViewDialog type="image" url={image}>
                    <Image className="object-cover hover:cursor-pointer" fill alt="Banner" src={image} width={0} height={0} unoptimized />
                </MediaViewDialog>
            ) : (
                <div className="w-full h-[200px] bg-gray-300"></div>
            )}
            {children}
        </div>
    );
}

export default ProfileBanner;