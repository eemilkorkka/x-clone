"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Popover } from "radix-ui"
import { ReactNode, Dispatch, useContext } from "react";
import { TweetsContext } from "@/Context/TweetsContext";
import { FaRegTrashCan } from "react-icons/fa6";
import { SlUserFollow } from "react-icons/sl";
import DeleteTweetDialog from "./DeleteTweetDialog";
import { follow } from "@/utils/utilFunctions";

interface TweetPopoverProps {
    children: ReactNode;
    username: string;
    tweetId: number;
}

const TweetPopover = ({ children, username, tweetId }: TweetPopoverProps) => {

    const session = useSession();
    const pathname = usePathname();
    const { setTweets } = useContext(TweetsContext)!;

    const isStatus = pathname.includes(`/${username}/status/`);
    const buttonStyles = "hover:bg-gray-100 border-none p-3 flex gap-2 outline-none items-center rounded-lg font-bold hover:cursor-pointer"

    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        follow(username);
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {children}
            </Popover.Trigger>
            <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content side={isStatus ? "bottom" : "left"} sideOffset={-22} align="end" alignOffset={6} className="w-72 flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg bg-white border-gray-200">
                    {username === session?.data?.user.username && (
                        <DeleteTweetDialog tweetId={tweetId} onDelete={() => {
                            setTweets?.(prev => prev.filter(tweet => tweet.ID !== tweetId));
                        }}
                        >
                            <button className={`${buttonStyles} ${"text-red-500"}`} onClick={(e) => e.stopPropagation()}><FaRegTrashCan /> Delete</button>
                        </DeleteTweetDialog>
                    )}
                    {username !== session?.data?.user.username && (
                        <button className={`${buttonStyles}`} onClick={(e) => handleFollowClick(e)}><SlUserFollow /> Follow @{username}</button>
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default TweetPopover;