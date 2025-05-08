"use client";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import ProfilePicture from "../Profile/ProfilePicture";
import Username from "../Profile/Username";  
import DisplayName from "../Profile/DisplayName";

interface UserCardProps {
    image: string;
    username: string;
    displayName: string;
    children?: ReactNode;
    style?: string;
}

const UserCard = ({ image, username, displayName, children, style }: UserCardProps) => {
    const session = useSession();

    return (
        <div className="w-full flex items-center justify-center">
            <ProfilePicture 
                image={image} 
                username={username} 
                showProfileHoverCard={session.data?.user?.username !== username} 
            />
            <div className={`${style ?? "flex"} pl-2.5 w-full xl:flex flex-col text-left`}>
                <DisplayName 
                    displayName={displayName.length > 15 ? displayName.substring(0, 15) + "..." : displayName} 
                    username={username}
                    showProfileHoverCard={session.data?.user.username !== username} 
                    variant="small" 
                />
                <Username username={username} showProfileHoverCard={session.data?.user.username !== username} />
            </div>
            <div className="w-full flex justify-end">
                {children}
            </div>
        </div>
    );
}

export default UserCard;