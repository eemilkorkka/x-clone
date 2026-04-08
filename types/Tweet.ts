import { Bookmark } from "./Bookmark";
import { File } from "./File";
import { Like } from "./Like";
import { UserWithFollowData } from "./User";

export type TweetBase = {
    id: number;
    createdAt: Date;
    userId: string;
    user?: UserWithFollowData | undefined;
    likes: Like[];
    retweets: Retweet[];
    bookmarks: Bookmark[];
    files: File[];
    _count?: {
        replies: number;
    } | undefined;
}

export interface RegularTweet extends TweetBase {
    tweetContent: string;
    isRetweet: false;
    originalTweetId: null;
    originalTweet: null;
    parentTweetId: null;
    parentTweet: null;
}

export interface ReplyTweet extends TweetBase {
    tweetContent: string;
    isRetweet: false;
    originalTweetId: null;
    originalTweet: null;
    parentTweetId: number;
    parentTweet: TweetBase;
}

export interface Retweet extends TweetBase {
    tweetContent: null;
    isRetweet: true;
    originalTweetId: number;
    originalTweet: Tweet;
    parentTweetId: null;
    parentTweet: null;
}

export type TweetsPage = {
    items: Tweet[];
    nextCursor: { createdAt: string; id: number } | null;
}

export type PinnedTweetQueryData = {
    pinnedTweet: Tweet | null;
}

export type Tweet = RegularTweet | ReplyTweet | Retweet;