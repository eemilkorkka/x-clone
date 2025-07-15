"use client";
import { useMemo, useCallback, useContext } from "react";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import ReplyDialog from "./ReplyDialog";
import { useMutation } from "@tanstack/react-query";
import { TweetData } from "@/types/tweetType";
import { QueryKeysContext } from "@/Context/QueryKeysContext";

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
    
    const { queryKeys } = useContext(QueryKeysContext)!;

    const userId = session.data && parseInt(session.data.user.id);

    const isViewingASpecificTweet = useMemo(() => {
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
        onMutate: async (endpoint: StatType) => {
            await queryClient.cancelQueries({ queryKey: ["tweets", queryKeys.currentTab] });
            await queryClient.cancelQueries({ queryKey: ["replies", queryKeys.parentTweetID] });
            await queryClient.cancelQueries({ queryKey: ["profileFeed", queryKeys.username, queryKeys.type] });
            await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

            const previousTweets = queryClient.getQueryData<TweetData[]>(["tweets", queryKeys.currentTab]);
            const previousReplies = queryClient.getQueryData<TweetData[]>(["replies", queryKeys.parentTweetID]);
            const previousProfileFeed = queryClient.getQueryData<TweetData[]>(["profileFeed", queryKeys.username, queryKeys.type]);
            const previousBookmarks = queryClient.getQueryData<TweetData[]>(["bookmarks"]);

            const updateTweetInPages = (oldData: InfiniteData<TweetData[]> | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: TweetData[]) =>
                        page.map((tweet: TweetData) => {
                            if (tweet.ID !== tweetId) return tweet;
                            const alreadyActive = (arr: { UserID: number }[]) => arr.some((item: { UserID: number }) => item.UserID === userId);
                            if (endpoint === "like") {
                                return {
                                    ...tweet,
                                    likes: alreadyActive(tweet.likes)
                                        ? tweet.likes.filter((like: { UserID: number }) => like.UserID !== userId)
                                        : [...tweet.likes, { UserID: userId }],
                                };
                            } else if (endpoint === "retweet") {
                                return {
                                    ...tweet,
                                    retweets: alreadyActive(tweet.retweets)
                                        ? tweet.retweets.filter((retweet: { UserID: number }) => retweet.UserID !== userId)
                                        : [...tweet.retweets, { UserID: userId }],
                                };
                            } else if (endpoint === "bookmark") {
                                return {
                                    ...tweet,
                                    bookmarks: alreadyActive(tweet.bookmarks)
                                        ? tweet.bookmarks.filter((bookmark: { UserID: number }) => bookmark.UserID !== userId)
                                        : [...tweet.bookmarks, { UserID: userId }],
                                };
                            }
                            return tweet;
                        })
                    ),
                };
            };

            queryClient.setQueryData(["tweets", queryKeys.currentTab], updateTweetInPages);
            queryClient.setQueryData(["replies", queryKeys.parentTweetID], updateTweetInPages);
            queryClient.setQueryData(["profileFeed", queryKeys.username, queryKeys.type], updateTweetInPages);
            queryClient.setQueryData(["bookmarks"], updateTweetInPages);

            return { previousTweets, previousReplies, previousProfileFeed, previousBookmarks };
        },
        onError: (err, endpoint, context) => {
            if (context?.previousTweets) queryClient.setQueryData(["tweets", queryKeys.currentTab], context.previousTweets);
            if (context?.previousReplies) queryClient.setQueryData(["replies", queryKeys.parentTweetID], context.previousReplies);
            if (context?.previousProfileFeed) queryClient.setQueryData(["profileFeed", queryKeys.username, queryKeys.type], context.previousProfileFeed);
            if (context?.previousBookmarks) queryClient.setQueryData(["bookmarks"], context.previousBookmarks);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets", queryKeys.currentTab] });
            queryClient.invalidateQueries({ queryKey: ["replies", queryKeys.parentTweetID] });
            queryClient.invalidateQueries({ queryKey: ["profileFeed", queryKeys.username, queryKeys.type] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
        onSuccess: (data) => {
            if (isViewingASpecificTweet) {
                router.refresh();
            }
            
            toast.success(data.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        },
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