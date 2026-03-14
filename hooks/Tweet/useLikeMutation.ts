import { likeTweet } from "@/app/actions/likeTweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { Tweet, TweetsPage, PinnedTweetQueryData } from "@/types/Tweet";
import { InfiniteData, QueryKey, useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProfileFeedQueryKey } from "../useGetProfileFeedQueryKey";

export const useLikeMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();
    const searchParams = useSearchParams();
    const params = useParams();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();

    const likeMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await likeTweet(formData);

            if (!result.success || result.error) {
                throw new Error(result.error || "Failed to like tweet");
            }

            return result;
        },
        onMutate: async () => {
            const tweetsQueryKey = ["tweets", data?.user.id, searchParams.get("feed") ?? "foryou"];
            const tweetQueryKey = ["tweet", tweet.id];
            const repliesQueryKey = ["replies", tweet.parentTweetId];
            const bookmarksQueryKey = ["bookmarks", data?.user.username];
            const pinnedQueryKey = ["pinnedTweet", params.username];

            await queryClient.cancelQueries({ queryKey: tweetsQueryKey });
            await queryClient.cancelQueries({ queryKey: tweetQueryKey });
            await queryClient.cancelQueries({ queryKey: repliesQueryKey });
            await queryClient.cancelQueries({ queryKey: profileFeedQueryKey });
            await queryClient.cancelQueries({ queryKey: bookmarksQueryKey });
            await queryClient.cancelQueries({ queryKey: pinnedQueryKey });

            const previousTweets = queryClient.getQueryData<InfiniteData<TweetsPage>>(tweetsQueryKey);
            const previousTweet = queryClient.getQueryData<Tweet>(tweetQueryKey);
            const previousReplies = queryClient.getQueryData<InfiniteData<TweetsPage>>(repliesQueryKey);
            const previousProfileTweets = queryClient.getQueryData<InfiniteData<TweetsPage>>(profileFeedQueryKey);
            const previousBookmarks = queryClient.getQueryData<InfiniteData<TweetsPage>>(bookmarksQueryKey);
            const previousPinnedTweet = queryClient.getQueryData<PinnedTweetQueryData>(pinnedQueryKey);

            if (!data?.user.id) return {
                previousTweets,
                previousTweet,
                previousReplies,
                previousProfileTweets,
                previousBookmarks,
                previousPinnedTweet,
                tweetsQueryKey,
                tweetQueryKey,
                repliesQueryKey,
                profileFeedQueryKey,
                bookmarksQueryKey,
                pinnedQueryKey,
            };

            const targetOriginalId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;

            const toggleLike = (currentTweet: Tweet): Tweet => ({
                ...currentTweet,
                likes: currentTweet.likes.some(like => like.userId === data.user.id)
                    ? currentTweet.likes.filter(like => like.userId !== data.user.id)
                    : [
                        ...currentTweet.likes,
                        {
                            id: -1,
                            userId: data.user.id,
                            tweetId: currentTweet.id,
                            createdAt: new Date(),
                        },
                    ],
            });

            const setQueryData = (queryKey: QueryKey, previousItems: InfiniteData<TweetsPage, unknown>) => {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(queryKey, {
                    ...previousItems,
                    pages: previousItems.pages.map(page => ({
                        ...page,
                        items: page.items.map((t) => {
                            const currentItemId = t.id;
                            const currentOriginalId = t.isRetweet ? t.originalTweetId : t.id;

                            const targetItemId = tweet.id;

                            const shouldUpdate =
                                currentItemId === targetItemId ||
                                currentOriginalId === targetOriginalId;

                            if (shouldUpdate) {
                                if (t.isRetweet && t.originalTweet) {
                                    return {
                                        ...t,
                                        originalTweet: toggleLike(t.originalTweet)
                                    };
                                } else {
                                    return toggleLike(t);
                                }
                            }
                            return t;
                        })
                    }))
                });
            }

            if (previousTweet) {
                queryClient.setQueryData<Tweet>(tweetQueryKey, toggleLike(previousTweet));
            }

            if (previousPinnedTweet?.pinnedTweet) {
                const pinnedTweetId = previousPinnedTweet.pinnedTweet.isRetweet 
                    ? previousPinnedTweet.pinnedTweet.originalTweetId 
                    : previousPinnedTweet.pinnedTweet.id;
                
                if (pinnedTweetId === targetOriginalId) {
                    queryClient.setQueryData<PinnedTweetQueryData>(pinnedQueryKey, {
                        ...previousPinnedTweet,
                        pinnedTweet: toggleLike(previousPinnedTweet.pinnedTweet),
                    });
                }
            }

            if (previousTweets) {
                setQueryData(tweetsQueryKey, previousTweets);
            }

            if (previousReplies) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(repliesQueryKey, {
                    ...previousReplies,
                    pages: previousReplies.pages.map(page => ({
                        ...page,
                        items: page.items.map((t) => {
                            if (t.id === tweet.id) {
                                return toggleLike(t);
                            }
                            return t;
                        })
                    }))
                });
            }

            if (previousProfileTweets) {
                setQueryData(profileFeedQueryKey, previousProfileTweets);
            }

            if (previousBookmarks) {
                setQueryData(bookmarksQueryKey, previousBookmarks);
            }

            const allTweetQueries = queryClient.getQueriesData<Tweet>({ queryKey: ["tweet"] });
            allTweetQueries.forEach(([queryKey, cachedTweet]) => {
                if (cachedTweet && cachedTweet.parentTweetId === tweet.id && cachedTweet.parentTweet) {
                    queryClient.setQueryData<Tweet>(queryKey, {
                        ...cachedTweet,
                        parentTweet: toggleLike(cachedTweet.parentTweet as Tweet)
                    });
                }
            });

            return {
                previousTweets,
                previousTweet,
                previousReplies,
                previousProfileTweets,
                previousBookmarks,
                previousPinnedTweet,
                tweetsQueryKey,
                tweetQueryKey,
                repliesQueryKey,
                profileFeedQueryKey,
                bookmarksQueryKey,
                pinnedQueryKey,
            };
        },
        onSuccess: (context) => {
            queryClient.invalidateQueries({ queryKey: ["profilefeed", "likes", data?.user.username, false] });
        },
        onError: (err, variables, context) => {
            if (context?.previousTweets) {
                queryClient.setQueryData(context.tweetsQueryKey, context.previousTweets);
            }

            if (context?.previousTweet) {
                queryClient.setQueryData(context.tweetQueryKey, context.previousTweet);
            }

            if (context?.previousPinnedTweet) {
                queryClient.setQueryData(context.pinnedQueryKey, context.previousPinnedTweet);
            }

            if (context?.previousReplies) {
                queryClient.setQueryData(context.repliesQueryKey, context.previousReplies);
            }

            if (context?.previousProfileTweets) {
                queryClient.setQueryData(context.profileFeedQueryKey, context.previousProfileTweets);
            }

            if (context?.previousBookmarks) {
                queryClient.setQueryData(context.bookmarksQueryKey, context.previousBookmarks);
            }
        }
    });

    return { likeMutation };
}