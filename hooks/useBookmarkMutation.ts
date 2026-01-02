import { bookmarkTweet } from "@/app/actions/bookmarkTweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { Tweet, TweetsPage } from "@/types/Tweet";
import { InfiniteData, useMutation } from "@tanstack/react-query";

export const useBookmarkMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();

    const bookmarkMutation = useMutation({
        mutationFn: bookmarkTweet,
        onMutate: async () => {
            const tweetsQueryKey = ["tweets"];
            const tweetQueryKey = ["tweet", tweet.id];

            await queryClient.cancelQueries({ queryKey: tweetsQueryKey });
            await queryClient.cancelQueries({ queryKey: tweetQueryKey });

            const previousTweets = queryClient.getQueryData<InfiniteData<TweetsPage>>(tweetsQueryKey);
            const previousTweet = queryClient.getQueryData<Tweet>(tweetQueryKey);

            if (!data?.user.id) return { previousTweets, previousTweet, tweetsQueryKey, tweetQueryKey };

            const toggleBookmark = (currentTweet: Tweet): Tweet => ({
                ...currentTweet,
                bookmarks: currentTweet.bookmarks.some(bookmark => bookmark.userId === data.user.id)
                    ? currentTweet.bookmarks.filter(bookmark => bookmark.userId !== data.user.id)
                    : [
                        ...currentTweet.bookmarks,
                        {
                            id: -1,
                            userId: data.user.id,
                            tweetId: currentTweet.id,
                            createdAt: new Date(),
                        },
                    ],
            });

            if (previousTweet) {
                queryClient.setQueryData<Tweet>(tweetQueryKey, toggleBookmark(previousTweet));
            }

            if (previousTweets) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(tweetsQueryKey, {
                    ...previousTweets,
                    pages: previousTweets.pages.map(page => ({
                        ...page,
                        items: page.items.map((t) => {
                            const currentItemId = t.id;
                            const currentOriginalId = t.isRetweet ? t.originalTweetId : t.id;

                            const targetItemId = tweet.id;
                            const targetOriginalId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;

                            const shouldUpdate =
                                currentItemId === targetItemId ||
                                currentOriginalId === targetOriginalId;

                            if (shouldUpdate) {
                                if (t.isRetweet && t.originalTweet) {
                                    return {
                                        ...t,
                                        originalTweet: toggleBookmark(t.originalTweet)
                                    };
                                } else {
                                    return toggleBookmark(t);
                                }
                            }
                            return t;
                        })
                    }))
                });
            }

            return { previousTweets, previousTweet, tweetsQueryKey, tweetQueryKey };
        },
        onError: (err, variables, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(context.tweetsQueryKey, context.previousTweets);
            }
            if (context?.previousTweet) {
                queryClient.setQueryData(context.tweetQueryKey, context.previousTweet);
            }
        }
    });

    return { bookmarkMutation };
}