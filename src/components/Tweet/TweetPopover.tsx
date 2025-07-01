"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Popover } from "radix-ui"
import { ReactNode, useContext, useEffect, useState } from "react";
import { TweetsContext } from "@/Context/TweetsContext";
import { FaRegTrashCan } from "react-icons/fa6";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import DeleteTweetDialog from "./DeleteTweetDialog";
import { follow } from "@/utils/utilFunctions";

interface TweetPopoverProps {
    children: ReactNode;
    username: string;
    tweetId: number;
}

const TweetPopover = ({ children, username, tweetId }: TweetPopoverProps) => {

    const { data } = useSession();
    const pathname = usePathname();
    const { setTweets } = useContext(TweetsContext)!;

    const isStatus = pathname.includes(`/${username}/status/`);
    const buttonStyles = "hover:bg-gray-100 border-none p-3 flex gap-2 outline-none items-center rounded-lg font-bold hover:cursor-pointer"

    const [open, setOpen] = useState<boolean>(false);
    const [followers, setFollowers] = useState<{ followerId: number }[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const handleFollowClick = (e: React.MouseEvent) => {
        setOpen(false);
        e.stopPropagation();
        follow(username);
    }

    useEffect(() => {
        if (!open) return;
        
        const fetchFollowers = async () => {
            const response = await fetch(`/api/users/${username}`);
            if (response.ok) {
                const json = await response.json();
                setFollowers(json.user.followers);
            }
        }

        fetchFollowers();
    }, [open, username]);

    useEffect(() => {
        setIsFollowing(followers.some((follower: { followerId: number }) => follower.followerId === parseInt(data?.user.id!)));
    }, [followers, data?.user.id]);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Popover.Trigger>
            <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content side={isStatus ? "bottom" : "left"} sideOffset={-22} align="end" alignOffset={6} className="w-72 flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg bg-white border-gray-200">
                    {username === data?.user.username && (
                        <DeleteTweetDialog tweetId={tweetId} onDelete={() => {
                            setTweets?.(prev => prev.filter(tweet => tweet.ID !== tweetId));
                        }}
                        >
                            <button className={`${buttonStyles} ${"text-red-500"}`} onClick={(e) => e.stopPropagation()}><FaRegTrashCan /> Delete</button>
                        </DeleteTweetDialog>
                    )}
                    {username !== data?.user.username && (
                        <button className={`${buttonStyles}`} onClick={(e) => handleFollowClick(e)}>
                            {isFollowing ? (
                                <>
                                    <SlUserUnfollow /> Unfollow @{username}
                                </>
                            ) : (
                                <>
                                    <SlUserUnfollow /> Follow @{username}
                                </>
                            )}
                        </button>
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default TweetPopover;