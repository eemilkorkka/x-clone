import { ReactNode } from "react";
import ProfilePicture from "./ProfilePicture";

interface UserCardProps {
    image: string;
    username: string;
    displayName: string;
    children?: ReactNode;
    style?: string;
}

const UserCard = ({ image, username, displayName, children, style }: UserCardProps) => {
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
                <ProfilePicture image={image} style="max-h-[40px]" />
                <div className={`${style ?? "flex"} xl:flex flex-col text-left`}>
                    <span className="font-bold whitespace-nowrap text-[15px]">{displayName.length > 15 ? displayName.substring(0, 15) + "..." : displayName}</span>
                    <span className="text-gray-500 whitespace-nowrap text-[15px]">@{username}</span>
                </div>
            </div>
            {children}
        </div>
    );
}

export default UserCard;