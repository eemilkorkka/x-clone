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

    const bookmarks = data?.pages.flatMap(page => page) || [];

    return (
        <div className="h-screen">
            {error && <span className="flex font-bold text-lg text-black justify-center p-4">Failed to load bookmarks, try again later.</span>}
            {bookmarks.map((bookmark) => {
                return (
                    <Tweet
                        key={bookmark.ID}
                        tweetType="tweet"
                        tweetId={bookmark.PostID}
                        username={bookmark.post.users.Username}
                        displayName={bookmark.post.users.DisplayName}
                        profilePicture={bookmark.post.users.ProfilePicture}
                        tweetContent={
                            {
                                text: bookmark.post.Content,
                                files: bookmark.post.files.map((file: { File_URL: string; File_Type: string }) => ({
                                    url: file.File_URL,
                                    type: file.File_Type
                                }))
                            }
                        }
                        timeStamp={new Date(bookmark.post.created_at)}
                        statValues={[bookmark.post.replies.length, bookmark.post.retweets.length, bookmark.post.likes.length]}
                        likes={bookmark.post.likes}
                        bookmarks={bookmark.post.bookmarks}
                        retweets={bookmark.post.retweets}
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