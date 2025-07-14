"use client";
import { useEffect, useContext } from "react";
import TweetBox from "../TweetBox/TweetBox";
import Tweet from "./Tweet";
import { TweetsContext } from "@/Context/TweetsContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useScrollListener } from "@/hooks/useScrollListener";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingBlock from "../Shared/LoadingBlock";
import { tweetsLimit } from "@/utils/tweet/tweetUtils";

interface RepliesWrapperProps {
    parentTweetID: number;
}

const RepliesWrapper = ({ parentTweetID }: RepliesWrapperProps) => {

    const { tweets, setTweets } = useContext(TweetsContext)!;

    const fetchData = async ({ pageParam }: { pageParam: number }) => {
        console.log("this ran");
        const response = await fetch(`/api/posts/replies?tweetId=${parentTweetID}&page=${pageParam}&limit=${tweetsLimit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch replies.");
        }
        return response.json();
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ["replies", parentTweetID],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.length + 1;
        },
    });

    useEffect(() => {
        if (data?.pages) {
            setTweets(data.pages.flatMap(page => page));
        }
    }, [data?.pages, setTweets]);
    
    const handleScroll = useInfiniteScroll(isFetching, hasNextPage, fetchNextPage);
    useScrollListener("main-scroll-container", handleScroll);

    return (
        <div className={`${tweets.length > 0 && "h-screen"}`}>
            <TweetBox type="reply" parentTweetID={parentTweetID} />
            { error && <span className="flex font-bold text-lg text-black justify-center p-4">Failed to load tweets, try again later.</span> }
            {tweets.map((tweet) => {
                return (
                    <Tweet
                        key={tweet.ID}
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
                        statValues={[tweet.replies.length, tweet.retweets.length, tweet.likes.length]}
                        likes={tweet.likes}
                        bookmarks={tweet.bookmarks}
                        retweets={tweet.retweets}
                    />
                );
            })}
            <LoadingBlock 
                isFetchingNextPage={isFetchingNextPage}
                status={status}
            />
        </div>
    );
}

export default RepliesWrapper;