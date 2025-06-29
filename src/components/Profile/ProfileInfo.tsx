"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import DisplayName from "./DisplayName";
import Username from "./Username";
import { RxCalendar } from "react-icons/rx";
import { User } from "@/types/userType";
import { Session } from "next-auth";
import Button from "../Shared/Button";
import { follow } from "@/utils/utilFunctions";
import EditProfileDialog from "./EditProfileDialog";
import formDataType from "@/types/formDataType";
import ProfileBanner from "./ProfileBanner";
import ProfilePicture from "./ProfilePicture";
import { IoIosLink } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";


interface ProfileInfoProps {
    user?: User;
    session?: Session | null;
    displayName?: string;
    username: string;
    coverPicture?: string;
    showJoinDate?: boolean;
    joinDate?: string;
    bio?: string;
    location?: string;
    website?: string;
    followers: { followerId: number }[];
    following: { followingId: number }[];
}

const ProfileInfo = (
    {
        user,
        session,
        displayName,
        username,
        coverPicture,
        showJoinDate,
        joinDate,
        bio,
        location,
        website,
        followers,
        following
    }: ProfileInfoProps) => {

    const [isFollowing, setIsFollowing] = useState<boolean>(followers.some(follower => follower.followerId === parseInt(session?.user.id!)));
    const [text, setText] = useState<string>("");

    const initialState = {
        profilePicture: user?.ProfilePicture ?? "",
        coverPicture: coverPicture ?? "",
        name: displayName ?? "",
        bio: bio ?? "",
        location: location ?? "",
        website: website ?? ""
    };

    const [formData, setFormData] = useState<formDataType>({
        profilePicture: initialState.profilePicture,
        coverPicture: initialState.coverPicture,
        name: initialState.name,
        bio: initialState.bio,
        location: initialState.location,
        website: initialState.website,
    });

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
            {showJoinDate && (
                <div className="-m-4">
                    <ProfileBanner image={formData.coverPicture ?? undefined}>
                        <ProfilePicture image={formData.profilePicture} style="w-full h-full top-full max-w-[133px] max-h-[133px] absolute left-4 -translate-y-1/2 border-4 border-white bg-white" />
                    </ProfileBanner>
                </div>
            )}
            {user && (
                <div className="flex justify-end mt-4 pr-4">
                    {session?.user?.username === username ? (
                        <EditProfileDialog
                            initialState={initialState}
                            formData={formData}
                            setFormData={setFormData}
                        >
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
                    <DisplayName displayName={formData.name} />
                    <Username username={username} />
                </div>
                <p>{formData.bio}</p>
                {showJoinDate && (
                    <span className="text-gray-500 flex flex-wrap items-left gap-2">
                        {location && (
                            <div className="flex items-center gap-1">
                                <LuMapPin />
                                {location}
                            </div>
                        )}
                        {website && (
                            <div className="flex items-center gap-1">
                                <IoIosLink />
                                <a href={website} target="_blank" className="text-xblue whitespace-nowrap hover:underline">{website}</a>
                            </div>
                        )}
                        <div className="flex items-center gap-1 whitespace-nowrap">
                            <RxCalendar />
                            Joined {joinDate}
                        </div>
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