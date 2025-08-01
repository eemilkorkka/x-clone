"use client";
import { ReactNode } from "react";
import ProfilePicture from "../Profile/ProfilePicture";
import Username from "../Profile/Username";  
import DisplayName from "../Profile/DisplayName";

interface UserCardProps {
    image: string;
    username: string;
    displayName: string;
    showUnderlineOnDisplayname?: boolean;
    isLogOutButton?: boolean;
    bio?: string;
    children?: ReactNode;
    style?: string;
}

const UserCard = ({ 
    image, 
    username, 
    displayName, 
    showUnderlineOnDisplayname = true,
    isLogOutButton = false, 
    bio, 
    style, 
    children 
}: UserCardProps) => {
    return (
        <div className="w-full flex items-start justify-center">
            <ProfilePicture 
                image={image} 
                username={username}
                showProfileHoverCard={isLogOutButton ? false : true}
                darkenOnHover={isLogOutButton ? false : true}
            />
            <div className={`xl:flex flex-1 pl-2.5 ${style}`}>
                <div className="flex items-center w-full justify-between">
                    <div className="flex flex-col text-left">
                        <DisplayName 
                            displayName={displayName.length > 15 ? displayName.substring(0, 15) + "..." : displayName}
                            username={username}
                            showProfileHoverCard={showUnderlineOnDisplayname && !isLogOutButton ? true : false}
                            showUnderlineOnHover={showUnderlineOnDisplayname}
                            variant="small"
                        />
                        <Username 
                            username={username}
                            showProfileHoverCard={isLogOutButton ? false : true}
                        />
                    </div>
                    {children}
                </div>
                {bio && <p>{bio}</p>}
            </div>
        </div>
    );
};

export default UserCard;
