"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import DisplayName from "./DisplayName";
import Username from "./Username";
import { displayNameVariants } from "./DisplayName";
import { RxCalendar } from "react-icons/rx";
import { User } from "@/types/userType";
import { Session } from "next-auth";
import Button from "../Shared/Button";
import EditProfileDialog from "./EditProfileDialog";
import { follow } from "@/utils/utilFunctions";


interface ProfileInfoProps {
    user?: User;
    session?: Session | null;
    displayName?: string;
    displayNameVariant?: keyof typeof displayNameVariants;
    username: string;
    showJoinDate?: boolean;
    joinDate?: string;
    bio: string;
    location?: string;
    followers: { followerId: number }[];
    following: { followingId: number }[];
}

const ProfileInfo = (
    {
        user,
        session,
        displayName,
        displayNameVariant,
        username,
        showJoinDate,
        joinDate,
        bio,
        location,
        followers,
        following
    }: ProfileInfoProps) => {
    
    const [isFollowing, setIsFollowing] = useState<boolean>(followers.some(follower => follower.followerId === parseInt(session?.user.id!)));
    const [text, setText] = useState<string>("");

    useEffect(() => {
        setText(isFollowing ? "Following" : "Follow");
    }, [isFollowing])
    
    const handleFollowClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFollowing(prev => !prev);
        follow(username);
    }

    return (
        <>
            {user && (
                <div className="flex justify-end mt-4 pr-4">
                    {session?.user?.username === username ? (
                        <EditProfileDialog session={session} displayName={displayName} bio={bio} location={location}>
                            <div>
                                <Button
                                    variant="outline"
                                    textColor="black"
                                    hoverColor="gray"
                                    style="text-sm px-4 pt-2 pb-2 border-gray-300!"
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </EditProfileDialog>
                    ) : (
                        <Button
                            variant={`${isFollowing ? "outline" : "black"}`}
                            hoverColor={isFollowing ? "red" : "gray"}
                            textColor="black"
                            style={`text-sm px-4 pt-2 pb-2 ${isFollowing && "hover:border-red-500! hover:text-red-500"}`}
                            onClick={(e) => handleFollowClick(e)}
                            onMouseOver={() => isFollowing && setText("Unfollow")}
                            onMouseLeave={() => isFollowing && setText("Following")}
                        >
                            {text}
                        </Button>
                    )}
                </div>
            )}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <DisplayName displayName={displayName!} variant={displayNameVariant} />
                    <Username username={username} />
                </div>
                <p>{bio}</p>
                {showJoinDate && (
                    <span className="text-gray-500 flex items-center gap-1">
                        <RxCalendar /> Joined {joinDate}
                    </span>
                )}
                <div className="flex gap-4">
                    <span className="text-black text-sm font-bold">{following.length} <span className="text-gray-500 text-sm font-normal">Following</span></span>
                    <span className="text-black text-sm font-bold">{followers.length} <span className="text-gray-500 text-sm font-normal">{followers.length === 1 ? "Follower" : "Followers"}</span></span>
                </div>
            </div>
        </>
    );
}

export default ProfileInfo; 