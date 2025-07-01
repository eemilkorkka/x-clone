import Image from "next/image";
import { ReactNode } from "react";

interface ProfileBannerProps {
    image?: string;
    children?: ReactNode;
}

const ProfileBanner = ({ image, children }: ProfileBannerProps) => {
    return (
        <div className="w-full h-[200px] max-h-[200px] relative">
            {image ? (
                <Image className="object-cover" fill alt="Banner" src={image} width={0} height={0} unoptimized />
            ) : (
                <div className="w-full h-[200px] bg-gray-300"></div>
            )}
            {children}
        </div>
    );
}

export default ProfileBanner;