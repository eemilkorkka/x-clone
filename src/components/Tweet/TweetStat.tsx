"use client";
import React from "react";
import { useMemo, useCallback } from "react";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import ReplyDialog from "./ReplyDialog";
import { useMutation } from "@tanstack/react-query";

type StatType = "reply" | "retweet" | "like" | "bookmark";

interface StatConfig {
    icon: React.JSX.Element;
    activeIcon?: React.JSX.Element;
    action?: () => Promise<void>;
    checkActive?: (userId: number, tweetId: number) => boolean;
}

interface TweetStatProps {
    type: StatType;
    tweetId: number;
    hoverBgColor?: string;
    hoverTextColor?: string;
    clickedColor?: string;
    statValue: number;
    likes: { UserID: number }[];
    retweets: { UserID: number }[];
    bookmarks: { UserID: number }[];
}

const TweetStat = ({
    type,
    tweetId,
    hoverBgColor,
    hoverTextColor,
    clickedColor,
    statValue,
    likes,
    retweets,
    bookmarks
}: TweetStatProps) => {
    const session = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

    const userId = session.data && parseInt(session.data.user.id);

    const isViewingASpecificTweet = React.useMemo(() => {
        const match = /^\/[^/]+\/status\/\d+$/.test(pathname);
        return match;
    }, [pathname]);

    const mutation = useMutation({
        mutationFn: async (endpoint: StatType) => {
            const response = await fetch(`/api/posts/${endpoint}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: tweetId }),
            });

            const json = await response.json();
            return json;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
            queryClient.invalidateQueries({ queryKey: ["replies", tweetId] });
            queryClient.invalidateQueries({ queryKey: ["profileFeed"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });

            isViewingASpecificTweet && router.refresh();

            toast.success(data.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        },
        onError: () => {
            toast.error("Action failed.", {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        }
    });

    const handleInteraction = useCallback(async (endpoint: StatType) => {
        if (type === "reply") return;
        mutation.mutate(endpoint);
    }, [type, mutation]);

    const statConfigs = useMemo<Record<StatType, StatConfig>>(() => ({
        reply: {
            icon: <FaRegComment size={18} />,
        },
        retweet: {
            icon: <AiOutlineRetweet size={18} />,
            action: async () => handleInteraction('retweet'),
            checkActive: (userId: number) =>
                retweets.some(retweet => retweet.UserID === userId)
        },
        like: {
            icon: <GoHeart size={18} />,
            activeIcon: <GoHeartFill size={18} />,
            action: async () => handleInteraction('like'),
            checkActive: (userId: number) =>
                likes.some(like => like.UserID === userId)
        },
        bookmark: {
            icon: <IoBookmarkOutline size={18} />,
            activeIcon: <IoBookmark size={18} />,
            action: async () => handleInteraction("bookmark"),
            checkActive: (userId: number) =>
                bookmarks.some(bookmark => bookmark.UserID === userId)
        }
    }), [retweets, likes, bookmarks, handleInteraction]);

    const clicked = userId && statConfigs[type].checkActive?.(userId, tweetId);

    const currentIcon = clicked && statConfigs[type].activeIcon
        ? statConfigs[type].activeIcon
        : statConfigs[type].icon;

    const tweetStatElement = (
        <div
            className={`flex items-center text-gray-600 ${clicked && type !== "reply" && (clickedColor ?? "text-xblue")
                } hover:cursor-pointer`}
            onClick={(e) => {
                e.stopPropagation();
                statConfigs[type].action?.();
            }}
        >
            <div className="group flex items-center">
                <div className={`rounded-full p-2 ${hoverBgColor ?? "hover:bg-xblue/10"} ${hoverTextColor ?? "hover:text-xblue"}`}>
                    {currentIcon}
                </div>
                {statValue > 0 && (
                    <span className={`text-sm ${hoverTextColor ?? "group-hover:text-xblue"}`}>
                        {statValue}
                    </span>
                )}
            </div>
        </div>
    );

    return type === "reply" ? (
        <ReplyDialog tweetId={tweetId}>
            {tweetStatElement}
        </ReplyDialog>
    ) : (
        tweetStatElement
    );
}

export default TweetStat;