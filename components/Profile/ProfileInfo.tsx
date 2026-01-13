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

    return (
        <div className="flex flex-col mb-4">
            <ProfileBanner src="">
                <div className="absolute -bottom-15 z-50 left-4 rounded-full border-white border-4">
                    <CustomAvatar src={""} alt={``} size="xl" />
                </div>
            </ProfileBanner>
            {data?.user.username === username ? (
                <Button variant="outline" className="rounded-full font-bold w-fit px-4 ml-auto mr-4 mt-2.5 shadow-none hover:cursor-pointer">Edit profile</Button>
            ) : (
                <Button className="rounded-full font-bold w-fit px-4 ml-auto mr-4 mt-2.5 hover:cursor-pointer">Follow</Button>
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
                <Text text={userData.bio} />
                <div className="flex">
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
                        <span className="text-zinc-500 font-normal">Followers</span>
                    </span>
                </div>
            </div>
        </div>
    )
}