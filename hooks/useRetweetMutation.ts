import { retweet } from "@/app/actions/retweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { Retweet, Tweet, TweetsPage } from "@/types/Tweet";
import { UserBase } from "@/types/User";
import { InfiniteData, useMutation } from "@tanstack/react-query";

export const useRetweetMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();

    const retweetMutation = useMutation({
        mutationFn: retweet,
        onMutate: async () => {
            const tweetsQueryKey = ["tweets"];
            const tweetQueryKey = ["tweet", tweet.id];

            await queryClient.cancelQueries({ queryKey: tweetsQueryKey });
            await queryClient.cancelQueries({ queryKey: tweetQueryKey });

            const previousTweets = queryClient.getQueryData<InfiniteData<TweetsPage>>(tweetsQueryKey);
            const previousTweet = queryClient.getQueryData<Tweet>(tweetQueryKey);

            if (!data?.user.id) return { previousTweets, previousTweet, tweetsQueryKey, tweetQueryKey };

            const targetTweetId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;
            const originalTweet = tweet.isRetweet ? tweet.originalTweet : tweet;

            const hasRetweeted = originalTweet.retweets.some(retweet => retweet.userId === data.user.id);

            const toggleRetweet = (currentTweet: Tweet): Tweet => {
                const currentTargetTweetId = currentTweet.isRetweet ? currentTweet.originalTweetId : currentTweet.id;

                return {
                    ...currentTweet,
                    retweets: currentTweet.retweets.some(retweet => retweet.userId === data.user.id)
                        ? currentTweet.retweets.filter(retweet => retweet.userId !== data.user.id)
                        : [
                            ...currentTweet.retweets,
                            {
                                id: -1,
                                createdAt: new Date(),
                                userId: data.user.id,
                                user: data.user as UserBase,
                                likes: [],
                                retweets: [],
                                bookmarks: [],
                                _count: {
                                    replies: 0,
                                },
                                tweetContent: null,
                                isRetweet: true,
                                originalTweetId: currentTargetTweetId,
                                originalTweet: currentTweet.isRetweet ? currentTweet.originalTweet : currentTweet,
                                parentTweetId: null,
                                parentTweet: null,
                            }
                        ],
                };
            };

            if (previousTweet) {
                queryClient.setQueryData<Tweet>(tweetQueryKey, toggleRetweet(previousTweet));
            }

            if (previousTweets) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(tweetsQueryKey, {
                    ...previousTweets,
                    pages: previousTweets.pages.map((page) => {
                        return {
                            ...page,
                            items: page.items
                                .filter(t => {
                                    if (hasRetweeted && t.isRetweet && t.userId === data.user.id && t.originalTweetId === targetTweetId) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((t) => {
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
                                                originalTweet: toggleRetweet(t.originalTweet)
                                            };
                                        } else {
                                            return toggleRetweet(t);
                                        }
                                    }
                                    return t;
                                })
                        };
                    })
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

    return { retweetMutation };
}