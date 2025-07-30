"use client";
import { useState, useContext, useEffect } from "react";
import TabSwitcher from "../Shared/TabSwitcher";
import TweetBox from "../TweetBox/TweetBox";
import Tweet from "../Tweet/Tweet";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useScrollListener } from "@/hooks/useScrollListener";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingBlock from "../Shared/LoadingBlock";
import MobileHeader from "../Layout/MobileHeader/MobileHeader";
import { User } from "@/types/User";
import { tweetsLimit } from "@/utils/tweet/tweetUtils";
import { QueryKeysContext } from "@/Context/QueryKeysContext";

interface HomeWrapperProps {
    user: User;
}

const HomeWrapper = ({ user }: HomeWrapperProps) => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    const { setQueryKeys } = useContext(QueryKeysContext)!;
    const tabs: string[] = ["For you", "Following"];

    useEffect(() => setQueryKeys((prevQueryKeys) => ({ ...prevQueryKeys, ["currentTab"]: currentTab })), [currentTab, setQueryKeys]);

    const fetchTweets = async ({ pageParam }: { pageParam: number }) => {
        const url = currentTab === 0 ? `/api/posts?page=${pageParam}&limit=${tweetsLimit}` : `/api/posts/following?page=${pageParam}&limit=${tweetsLimit}`

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch tweets.");
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
        queryKey: ['tweets', currentTab],
        queryFn: fetchTweets,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.length + 1;
        },
    });

    const handleScroll = useInfiniteScroll(isFetching, hasNextPage, fetchNextPage);
    useScrollListener("main-scroll-container", handleScroll);

    const tweets = data?.pages.flatMap(page => page) || [];

    return (
        <div className="h-screen">
            <MobileHeader user={user} />
            <TabSwitcher
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                style="bg-white/90! backdrop-blur-sm!"
            />
            <TweetBox type="tweet" />
            {error && <span className="flex font-bold text-lg text-black justify-center p-4">Failed to load tweets, try again later.</span>}
            {!error && tweets.map((tweet) => {
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

export default HomeWrapper;