"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Tweet from "../Tweet/Tweet";
import { useScrollListener } from "@/hooks/useScrollListener";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingBlock from "../Shared/LoadingBlock";
import MediaGrid from "../Media/MediaGrid";
import Media from "../Media/Media";
import Link from "next/link";
import { tweetsLimit } from "@/utils/tweet/tweetUtils";
import { useContext, useEffect } from "react";
import { QueryKeysContext } from "@/Context/QueryKeysContext";

interface ProfileFeedWrapperProps {
    type: "tweets" | "replies" | "media" | "like";
    username: string;
    displayName: string;
    userId?: number;
}

const ProfileFeedWrapper = ({ type, username, displayName, userId }: ProfileFeedWrapperProps) => {

    const getUrl = (pageParam: number): string => {
        return type === "tweets" 
        ? `/api/${username}?page=${pageParam}&limit=${tweetsLimit}` 
        : `/api/posts/${type}?username=${username}&userId=${userId}&page=${pageParam}&limit=${tweetsLimit}`;
    }

    const fetchData = async ({ pageParam } : { pageParam: number }) => {
        const response = await fetch(getUrl(pageParam));
        if (!response.ok) {
            throw new Error("Failed to fetch data.");
        }
        return response.json();
    }

    const { setQueryKeys } = useContext(QueryKeysContext)!;

    useEffect(() => setQueryKeys((prevQueryKeys) => ({ ...prevQueryKeys, ["username"]: username, ["type"]: type })), [username, type, setQueryKeys]);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['profileFeed', username, type],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.length + 1;
        },
    });

    const handleScroll = useInfiniteScroll(isFetching, hasNextPage, fetchNextPage);
    useScrollListener("main-scroll-container", handleScroll);

    if (error) return (
        <span className="flex font-bold text-lg text-black justify-center p-4">Failed to load tweets, try again later.</span>
    )

    const tweets = data?.pages.flatMap(page => page) || [];

    return type !== "media" ? (
        <div className="h-screen">
            {tweets.map((tweet, index) => {
                return (
                    <Tweet
                        key={index}
                        tweetType="tweet"
                        tweetId={tweet.ID}
                        username={tweet.users.Username}
                        displayName={tweet.users.DisplayName}
                        profilePicture={tweet.users.ProfilePicture}
                        tweetContent={
                            {
                                text: tweet.Content,
                                files: tweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                    url: file.File_URL,
                                    type: file.File_Type
                                }))
                            }
                        }
                        timeStamp={new Date(tweet.created_at!)}
                        isRetweet={tweet.isRetweet}
                        profile={displayName}
                        statValues={[tweet.replies.length, tweet.retweets.length, tweet.likes.length]}
                        likes={tweet.likes}
                        bookmarks={tweet.bookmarks}
                        retweets={tweet.retweets}
                    />
                )
            })}
            <LoadingBlock 
                isFetchingNextPage={isFetchingNextPage}
                status={status}
            />
        </div>
    ) : (
        <MediaGrid>
            {data?.pages.flatMap(page => page).map((tweet) => {
                return (
                    <Link href={`/${username}/status/${tweet.ID}`} className="aspect-square w-full max-w-xs" key={tweet.ID}>
                        <Media type={tweet.files[0].File_Type} url={tweet.files[0].File_URL} />
                    </Link>
                )
            })}
        </MediaGrid>
    )
}

export default ProfileFeedWrapper;