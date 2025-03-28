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
        <div className="w-full flex items-center justify-center">
            <ProfilePicture image={image} />
            <div className={`${style ?? "flex"} pl-2.5 w-full xl:flex flex-col text-left`}>
                <span className="font-bold whitespace-nowrap text-[16px]">{displayName.length > 15 ? displayName.substring(0, 15) + "..." : displayName}</span>
                <span className="text-gray-500 whitespace-nowrap text-[16px]">@{username}</span>
            </div>
            <div className="w-full flex justify-end">
                {children}
            </div>
        </div>
    );
}

export default UserCard;