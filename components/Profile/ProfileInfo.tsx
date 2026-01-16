"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { CustomAvatar } from "../User/CustomAvatar"
import { ProfileBanner } from "./ProfileBanner"
import { Displayname } from "../User/Displayname";
import { useQuery } from "@tanstack/react-query";
import { Username } from "../User/Username";
import { Text } from "../Text";
import { notFound } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";
import { RiLinkM } from "react-icons/ri";
import { GrLocation } from "react-icons/gr";
import Link from "next/link";
import { MediaDialog } from "../Media/MediaDialog";
import { FollowButton } from "../User/FollowButton";
import { Follower } from "@/types/Follower";
import { useColor } from "@/context/ColorContext";

interface ProfileInfoProps {
    username: string;
}

const getUserInfo = async (username: string) => {
    const response = await fetch(`/api/users/${username}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to get user's info.");
    }
}

export const ProfileInfo = ({ username }: ProfileInfoProps) => {

    const { data } = authClient.useSession();

    const { data: userData } = useQuery({
        queryFn: () => getUserInfo(username),
        queryKey: ["user", username]
    });

    if (!userData) {
        notFound();
    }

    const { colors } = useColor();
    const isFollowing = userData.followers.some((follower: Follower) => follower.followerId === data?.user.id);

    return (
        <div className="flex flex-col mb-4">
            <ProfileBanner src={userData.profileBannerImage ?? ""} >
                <MediaDialog src={userData.image ?? ""}>
                    <div className="absolute -bottom-15 z-50 left-4 rounded-full border-white border-4">
                        <CustomAvatar src={userData.image ?? ""} alt={``} size="xl" useLink={false} />
                    </div>
                </MediaDialog>
            </ProfileBanner>
            {data?.user.username === username ? (
                <Link href="/settings/profile" className="ml-auto">
                    <Button variant="outline" className="rounded-full font-bold w-fit px-4 mr-4 mt-2.5 shadow-none hover:cursor-pointer">Edit profile</Button>
                </Link>
            ) : (
                <FollowButton
                    userId={userData.id}
                    username={userData.username ?? ""}
                    isFollowing={isFollowing}
                    styles="ml-auto mt-4 mr-4"
                />
            )}
            <div className="px-4 mt-8 flex flex-col gap-2">
                <div>
                    <Displayname
                        displayName={userData.displayUsername}
                        username={userData.username}
                        useLink={false}
                        styles="text-xl w-fit"
                    />
                    <Username
                        username={userData.username}
                        useLink={false}
                        styles="w-fit"
                    />
                </div>
                <Text text={userData.bio ?? "Lorem ipsum dolor sit amet"} />
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {userData.location && (
                        <div className="text-sm flex items-center gap-1.5 text-zinc-500">
                            <GrLocation size={17} />
                            <span>{userData.location}</span>
                        </div>
                    )}
                    {userData.website && (
                        <div className="text-sm flex items-center gap-1.5 text-zinc-500">
                            <RiLinkM size={17} />
                            <Link href={userData.website} className={`${colors.textColor} hover:underline`} rel="noopener noreferrer" target="_blank">
                                {userData.website}
                            </Link>
                        </div>
                    )}
                    <div className="text-sm flex items-center gap-1.5 text-zinc-500">
                        <IoCalendarOutline size={17} />
                        <span>
                            Joined {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
                <div className="flex gap-8 text-sm">
                    <span className="font-semibold text-black">
                        {userData.following.length}
                        {' '}
                        <span className="text-zinc-500 font-normal">Following</span>
                    </span>
                    <span className="font-semibold text-black">
                        {userData.followers.length}
                        {' '}
                        <span className="text-zinc-500 font-normal">{userData.followers.length === 1 ? "Follower" : "Followers"}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}