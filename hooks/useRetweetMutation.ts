import { retweet } from "@/app/actions/retweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { Tweet, TweetsPage } from "@/types/Tweet";
import { UserWithFollowData } from "@/types/User";
import { InfiniteData, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useGetProfileFeedQueryKey } from "./useGetProfileFeedQueryKey";

export const useRetweetMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();
    const searchParams = useSearchParams();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();

    const retweetMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await retweet(formData);

            if (!result.success || result.error) {
                throw new Error(result.error || "Failed to retweet");
            }

            return result;
        },
        onMutate: async () => {
            const tweetsQueryKey = ["tweets", data?.user.id, searchParams.get("feed") ?? "foryou"];
            const tweetQueryKey = ["tweet", tweet.id];
            const repliesQueryKey = ["replies", tweet.parentTweetId];

            await queryClient.cancelQueries({ queryKey: tweetsQueryKey });
            await queryClient.cancelQueries({ queryKey: tweetQueryKey });
            await queryClient.cancelQueries({ queryKey: repliesQueryKey });
            await queryClient.cancelQueries({ queryKey: profileFeedQueryKey });

            const previousTweets = queryClient.getQueryData<InfiniteData<TweetsPage>>(tweetsQueryKey);
            const previousTweet = queryClient.getQueryData<Tweet>(tweetQueryKey);
            const previousReplies = queryClient.getQueryData<InfiniteData<TweetsPage>>(repliesQueryKey);
            const previousProfileTweets = queryClient.getQueryData<InfiniteData<TweetsPage>>(profileFeedQueryKey);

            if (!data?.user.id) return {
                previousTweets,
                previousTweet,
                previousReplies,
                previousProfileTweets,
                tweetsQueryKey,
                tweetQueryKey,
                repliesQueryKey,
                profileFeedQueryKey
            };

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
                                user: {
                                    ...data.user,
                                    followers: [],
                                    following: [],
                                } as UserWithFollowData,
                                likes: [],
                                retweets: [],
                                bookmarks: [],
                                files: [],
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

            if (previousReplies) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(repliesQueryKey, {
                    ...previousReplies,
                    pages: previousReplies.pages.map(page => ({
                        ...page,
                        items: page.items.map((t) => {
                            if (t.id === tweet.id) {
                                return toggleRetweet(t);
                            }
                            return t;
                        })
                    }))
                });
            }

            if (previousProfileTweets) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(profileFeedQueryKey, {
                    ...previousProfileTweets,
                    pages: previousProfileTweets.pages.map((page) => {
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

            return {
                previousTweets,
                previousTweet,
                previousReplies,
                previousProfileTweets,
                tweetsQueryKey,
                tweetQueryKey,
                repliesQueryKey,
                profileFeedQueryKey
            };
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ["replies", tweet.parentTweetId ] });
            
            if (tweet.originalTweet) {
                queryClient.invalidateQueries({ queryKey: ["replies", tweet.originalTweet.parentTweetId ] });
            }

            queryClient.invalidateQueries({ queryKey: context.profileFeedQueryKey });
        },
        onError: (err, variables, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(context.tweetsQueryKey, context.previousTweets);
            }

            if (context?.previousTweet) {
                queryClient.setQueryData(context.tweetQueryKey, context.previousTweet);
            }

            if (context?.previousReplies) {
                queryClient.setQueryData(context.repliesQueryKey, context.previousReplies);
            }

            if (context?.previousProfileTweets) {
                queryClient.setQueryData(context.profileFeedQueryKey, context.previousProfileTweets);
            }
        }
    });

    return { retweetMutation };
}