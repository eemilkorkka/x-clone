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
    showUnderlineOnDisplayname?: boolean;
    bio?: string;
    children?: ReactNode;
    style?: string;
}

const UserCard = ({ 
    image, 
    username, 
    displayName, 
    showUnderlineOnDisplayname = true, 
    bio, 
    style, 
    children 
}: UserCardProps) => {
    const session = useSession();

    return (
        <div className="w-full flex items-start justify-center">
            <ProfilePicture 
                image={image} 
                username={username}
                showProfileHoverCard={session.data?.user?.username !== username}
            />
            <div className={`xl:flex flex-1 pl-2.5 ${style}`}>
                <div className="flex items-center w-full justify-between">
                    <div className="flex flex-col text-left">
                        <DisplayName 
                            displayName={displayName.length > 15 ? displayName.substring(0, 15) + "..." : displayName}
                            username={username}
                            showProfileHoverCard={session.data?.user?.username !== username}
                            showUnderlineOnHover={showUnderlineOnDisplayname}
                            variant="small"
                        />
                        <Username 
                            username={username}
                            showProfileHoverCard={session.data?.user?.username !== username}
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
