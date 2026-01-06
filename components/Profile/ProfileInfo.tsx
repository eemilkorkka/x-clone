"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { CustomAvatar } from "../User/CustomAvatar"
import { ProfileBanner } from "./ProfileBanner"
import { Displayname } from "../User/Displayname";
import { useQuery } from "@tanstack/react-query";
import { UserBase } from "@/types/User";
import { Username } from "../User/Username";
import { Text } from "../Text";
import { notFound } from "next/navigation";

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
        <div className="flex flex-col">
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
            <div className="px-4 mt-8 flex flex-col">
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
                <Text text="Standing with the people of @Ukraine! Слава Україні! 💪" styles="my-2" />
            </div>
        </div>
    )
}