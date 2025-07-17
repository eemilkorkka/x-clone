"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Popover } from "radix-ui"
import { ReactNode, useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import DeleteTweetDialog from "./DeleteTweetDialog";
import { follow } from "@/utils/utilFunctions";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { tweetType } from "./Tweet";

interface TweetPopoverProps {
    children: ReactNode;
    username: string;
    tweetId: number;
    tweetType: tweetType;
}

const TweetPopover = ({ children, username, tweetId, tweetType }: TweetPopoverProps) => {

    const { data } = useSession();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const isStatus = pathname.includes(`/${username}/status/`);
    const buttonStyles = "hover:bg-gray-100 border-none p-3 flex gap-2 outline-none items-center rounded-lg font-bold hover:cursor-pointer"

    const [open, setOpen] = useState<boolean>(false);
    const [followers, setFollowers] = useState<{ followerId: number }[] | undefined>(undefined);
    const isFollowing = followers && followers.some((follower: { followerId: number }) => follower.followerId === parseInt(data?.user.id ?? ""));

    const handleFollowClick = async (e: React.MouseEvent) => {
        setOpen(false);
        e.stopPropagation();
        const response = await follow(username);
        const json = await response?.json();
        queryClient.invalidateQueries({ queryKey: ["follows"]});

        if (response?.ok) {
            toast.success(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        } else {
            toast.error(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        }
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

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Popover.Trigger>
            <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content side={isStatus ? "bottom" : "left"} sideOffset={-22} align="end" alignOffset={6} className="w-72 flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg bg-white border-gray-200">
                    {username === data?.user.username && (
                        <DeleteTweetDialog tweetId={tweetId} tweetType={tweetType}>
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
                                    <SlUserFollow /> Follow @{username}
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