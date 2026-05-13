import { ReadonlyURLSearchParams } from "next/navigation";

type Username = string | null | undefined;

export const queryKeys = {
    tweets: (userId: string | undefined, searchParams: ReadonlyURLSearchParams) => ["tweets", userId, searchParams.get("feed") ?? "foryou"],
    tweet: (tweetId: number) => ["tweet", tweetId],
    replies: (parentTweetId: number | null) => ["replies", parentTweetId],
    pinnedTweet: (username: Username) => ["pinnedTweet", username],
    bookmarks: (username: Username) => ["bookmarks", username],
    authorsProfileFeed: (username: Username, includeReplies: boolean) => ["profilefeed", "posts", username, includeReplies] 
}