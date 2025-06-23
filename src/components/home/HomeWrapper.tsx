"use client";
import { useContext, useEffect, useState } from "react";
import TabSwitcher from "../Shared/TabSwitcher";
import TweetBox from "../TweetBox/TweetBox";
import Tweet from "../Tweet/Tweet";
import { TweetsContext } from "@/Context/TweetsContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useScrollListener } from "@/hooks/useScrollListener";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingBlock from "../Shared/LoadingBlock";

const fetchTweets = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(`http://localhost:3000/api/posts?page=${pageParam}&limit=${10}`);
    if (!response.ok) {
        throw new Error("Failed to fetch tweets.");
    }
    return response.json();
}

const HomeWrapper = () => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['tweets'],
        queryFn: fetchTweets,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.length + 1;
        },
    });

    const tabs: string[] = ["For you", "Following"];
    const [currentTab, setCurrentTab] = useState<number>(0);
    const { tweets, setTweets } = useContext(TweetsContext)!;

    useEffect(() => {
        data?.pages && setTweets(data.pages.flatMap(page => page));
    }, [data?.pages, setTweets]);

    const handleScroll = useInfiniteScroll(isFetching, hasNextPage, fetchNextPage);
    useScrollListener("main-scroll-container", handleScroll);

    return (
        <>
            <TabSwitcher
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                style="bg-white/90! backdrop-blur-sm!"
            />
            <TweetBox type="tweet" />
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
            })
            }
            <LoadingBlock
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                status={status}
            />
        </>
    );
}

export default HomeWrapper;