import Image from "next/image";
import { ReactNode } from "react";

interface ProfileBannerProps {
    image: string;
    children?: ReactNode;
}

const ProfileBanner = ({ image, children }: ProfileBannerProps) => {
    return (
        <div className="w-full max-h-[200px] relative">
            <Image className="w-full h-full" alt="Banner" src={image} width={0} height={0} unoptimized />
            {children}
        </div>
    );
}

export default ProfileBanner;