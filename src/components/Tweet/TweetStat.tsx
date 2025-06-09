"use client";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { TweetsContext } from "@/Context/TweetsContext";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ReplyDialog from "./ReplyDialog";

type StatType = "reply" | "retweet" | "like" | "bookmark";

interface StatConfig {
    icon: React.JSX.Element;
    activeIcon?: React.JSX.Element;
    action?: () => Promise<void>;
    checkActive?: (userId: string, tweetId: number) => boolean;
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
    const [clicked, setClicked] = useState<boolean>(false);
    const [localStatValue, setLocalStatValue] = useState<number>(statValue);
    const session = useSession();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { setTweets } = useContext(TweetsContext)!;

    useEffect(() => {
        setLocalStatValue(statValue);
    }, [statValue, tweetId]);

    const handleInteraction = async (endpoint: StatType) => {
        if (type === "reply") return;

        try {
            type !== "bookmark" && setLocalStatValue(prev => clicked ? prev - 1 : prev + 1);
            setClicked(prev => !prev);

            const response = await fetch(`http://localhost:3000/api/posts/${endpoint}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: tweetId }),
            });

            const json = await response.json();

            if (!response.ok) {
                type !== "bookmark" && setLocalStatValue(prev => clicked ? prev + 1 : prev - 1);
                setClicked(prev => !prev);
            } else {
                if (type === "retweet" && clicked) setTweets?.(prev => prev.filter(tweet => !(tweet.isRetweet && tweet.ID === tweetId)))

                queryClient.invalidateQueries({ queryKey: ['tweets'] });
                queryClient.invalidateQueries({ queryKey: ['tweet', tweetId] });
                queryClient.invalidateQueries({ queryKey: ['replies', tweetId] });

                router.refresh();

                toast.success(json.message, {
                    style: {
                        background: "#1D9BF0",
                        color: "white"
                    }
                });
            }
        } catch (error) {
            console.error(`Error ${endpoint}ing post:`, error);
            type !== "bookmark" && setLocalStatValue(prev => clicked ? prev + 1 : prev - 1);
            setClicked(prev => !prev);
        }
    };

    const statConfigs: Record<StatType, StatConfig> = {
        reply: {
            icon: <FaRegComment size={18} />,
        },
        retweet: {
            icon: <AiOutlineRetweet size={18} />,
            action: async () => handleInteraction('retweet'),
            checkActive: (userId) =>
                retweets.some(retweet => retweet.UserID === parseInt(userId))
        },
        like: {
            icon: <GoHeart size={18} />,
            activeIcon: <GoHeartFill size={18} />,
            action: async () => handleInteraction('like'),
            checkActive: (userId) =>
                likes.some(like => like.UserID === parseInt(userId))
        },
        bookmark: {
            icon: <IoBookmarkOutline size={18} />,
            activeIcon: <IoBookmark size={18} />,
            action: async () => handleInteraction("bookmark"),
            checkActive: (userId) =>
                bookmarks.some(bookmark => bookmark.UserID === parseInt(userId))
        }
    };

    useEffect(() => {
        if (session.data?.user?.id && statConfigs[type].checkActive) {
            setClicked(statConfigs[type].checkActive(session.data.user.id, tweetId));
        }
    }, [session.data?.user?.id, type, tweetId]);

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
                {localStatValue > 0 && (
                    <span className={`text-sm ${hoverTextColor ?? "group-hover:text-xblue"}`}>
                        {localStatValue}
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