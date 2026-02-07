import { bookmarkTweet } from "@/app/actions/bookmarkTweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { Tweet, TweetsPage } from "@/types/Tweet";
import { InfiniteData, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useGetProfileFeedQueryKey } from "./useGetProfileFeedQueryKey";

export const useBookmarkMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();
    const searchParams = useSearchParams();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();

    const bookmarkMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await bookmarkTweet(formData);
            
            if (!result.success || result.error) {
                throw new Error(result.error || "Failed to bookmark tweet");
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

            if (previousReplies) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(repliesQueryKey, {
                    ...previousReplies,
                    pages: previousReplies.pages.map(page => ({
                        ...page,
                        items: page.items.map((t) => {
                            if (t.id === tweet.id) {
                                return toggleBookmark(t);
                            }
                            return t;
                        })
                    }))
                });
            }

            if (previousProfileTweets) {
                queryClient.setQueryData<InfiniteData<TweetsPage>>(profileFeedQueryKey, {
                    ...previousProfileTweets,
                    pages: previousProfileTweets.pages.map(page => ({
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks", data?.user.username] });
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

    return { bookmarkMutation };
}