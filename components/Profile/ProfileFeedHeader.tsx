"use client";

import { FeedHeader } from "../FeedHeader";
import { ReturnBack } from "../ReturnBack";
import { usePathname } from "next/navigation";
import { Displayname } from "../User/Displayname";

interface ProfileFeedHeaderProps {
    username: string;
    displayName: string;
    postsCount: number;
    likesCount: number;
    mediaCount: number;
}

export const ProfileFeedHeader = ({ username, displayName, postsCount, likesCount, mediaCount }: ProfileFeedHeaderProps) => {

    const pathname = usePathname();
    const pathnameParts = pathname.split("/");
    const currentPage = pathnameParts[pathnameParts.length - 1];

    const count = currentPage === "likes" ? likesCount : currentPage === "media" ? mediaCount : postsCount;
    const label = currentPage === "likes" ? "likes" : currentPage === "media" ? "photos & videos" : "posts";

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
                {<p className="text-sm text-zinc-500">{count} {label}</p>}
            </div>
        </FeedHeader>
    )
}