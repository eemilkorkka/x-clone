"use client";

import { authClient } from "@/lib/auth-client";
import { FeedHeader } from "../FeedHeader";
import { ReturnBack } from "../ReturnBack";
import { usePathname } from "next/navigation";
import { Displayname } from "../User/Displayname";

interface ProfileFeedHeaderProps {
    username: string;
    displayName: string;
    postsCount: number;
}

export const ProfileFeedHeader = ({ username, displayName, postsCount }: ProfileFeedHeaderProps) => {

    const pathname = usePathname();

    return (
        <FeedHeader styles="items-center px-2 gap-6">
            <ReturnBack />
            <div className="flex flex-col">
                <Displayname
                    displayName={displayName}
                    username={username}
                    useLink={false}
                    styles="text-lg"
                />
                {<p className="text-sm text-zinc-500">{postsCount} posts</p>}
            </div>
        </FeedHeader>
    )
}