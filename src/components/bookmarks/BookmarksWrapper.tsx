"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useScrollListener } from "@/hooks/useScrollListener";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Tweet from "@/components/Tweet/Tweet";
import LoadingBlock from "@/components/Shared/LoadingBlock";
import { tweetsLimit } from "@/utils/tweet/tweetUtils";

const fetchBookmarks = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(`/api/posts/bookmark?page=${pageParam}&limit=${tweetsLimit}`);
    if (!response.ok) {
        throw new Error("Failed to fetch bookmarks.");
    }
    return response.json();
}

const BookmarksWrapper = () => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['bookmarks'],
        queryFn: fetchBookmarks,
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
            {error && <span className="flex font-bold text-lg text-black justify-center p-4">Failed to load bookmarks, try again later.</span>}
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
    )
}

export default BookmarksWrapper;