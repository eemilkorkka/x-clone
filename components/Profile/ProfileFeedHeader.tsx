"use client";

import { authClient } from "@/lib/auth-client";
import { FeedHeader } from "../FeedHeader";
import { ReturnBack } from "../ReturnBack";
import { usePathname } from "next/navigation";
import { Displayname } from "../User/Displayname";

interface ProfileFeedHeaderProps {
    username: string;
    displayName: string;
    userFound: boolean;
    postsCount: number;
}

export const ProfileFeedHeader = ({ username, displayName, userFound, postsCount }: ProfileFeedHeaderProps) => {

    const pathname = usePathname();

    return (
        <FeedHeader>
            <div className="flex items-center px-2 gap-6">
                <ReturnBack />
                <div className="flex flex-col">
                    <Displayname
                        displayName={userFound ? displayName : "Profile"}
                        username={username}
                        useLink={false}
                        styles="text-lg"
                    />
                    {userFound && <p className="text-sm text-zinc-500">{postsCount} posts</p>}
                </div>
            </div>
        </FeedHeader>
    )
}