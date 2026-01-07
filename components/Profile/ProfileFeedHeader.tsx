"use client";

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
    const pathnameParts = pathname.split("/");

    return (
        <FeedHeader styles="items-center px-2 gap-6 sticky top-0 z-55 backdrop-blur-lg bg-white/80">
            <ReturnBack />
            <div className="flex flex-col">
                <Displayname
                    displayName={displayName}
                    username={username}
                    useLink={false}
                    styles="text-lg"
                />
                {<p className="text-sm text-zinc-500">{postsCount} {pathnameParts[pathnameParts.length - 1] === "likes" ? "likes" : "posts"}</p>}
            </div>
        </FeedHeader>
    )
}