import { FaRegComment, FaRegHeart, FaRegBookmark, FaHeart, FaBookmark } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { TweetAction } from "./TweetAction";
import { Tweet } from "@/types/Tweet";
import { authClient } from "@/lib/auth-client";
import { likeTweet } from "@/app/actions/likeTweet";
import { retweet } from "@/app/actions/retweet";
import { useMutation } from "@tanstack/react-query";
import { bookmarkTweet } from "@/app/actions/bookmarkTweet";
import { twMerge } from "tailwind-merge";
import {  useComposeModal } from "../ComposeModalContext";
import { useRouter } from "next/navigation";

interface TweetActionsProps {
    type: "status" | "tweet";
    tweet: Tweet;
    styles?: string;
}

export const TweetActions = ({ type, tweet, styles }: TweetActionsProps) => {

    const { data } = authClient.useSession();
    const router = useRouter();

    const likeMutation = useMutation({
        mutationFn: likeTweet
    });

    const retweetMutation = useMutation({
        mutationFn: retweet
    });

    const bookmarkMutation = useMutation({
        mutationFn: bookmarkTweet
    });

    const { setTweetToReplyTo } = useComposeModal();

    const handleReplyActionClick = () => {
        tweet.isRetweet ? setTweetToReplyTo(tweet.originalTweet) : setTweetToReplyTo(tweet);
        router.push("/compose/post");
    }

    return (
        <div className={twMerge("flex justify-between -ml-2", styles)}>
            <TweetAction
                tweetId={tweet.id}
                statCount={tweet.isRetweet ? tweet.originalTweet._count?.replies : tweet._count?.replies}
                icon={<FaRegComment />}
                onClick={handleReplyActionClick}
            />
            <TweetAction
                tweetId={tweet.id}
                statCount={tweet.isRetweet ? tweet.originalTweet.likes.length : tweet.likes.length}
                icon={<FaRegHeart />}
                activeIcon={<FaHeart className="text-rose-500" />}
                hoverBgColor="group-hover:bg-rose-500/20"
                hoverTextColor="group-hover:text-rose-500"
                activeColor="text-rose-500"
                isActive={tweet.isRetweet ? tweet.originalTweet.likes.some((like) => like.userId === data?.user.id) : tweet.likes.some((like) => like.userId === data?.user.id)}
                mutation={likeMutation}
            />
            <TweetAction
                tweetId={tweet.id}
                statCount={tweet.isRetweet ? tweet.originalTweet.retweets.length : tweet.retweets.length}
                icon={<AiOutlineRetweet />}
                hoverBgColor="group-hover:bg-emerald-500/20"
                hoverTextColor="group-hover:text-emerald-500"
                activeColor="text-emerald-500"
                isActive={tweet.isRetweet ? tweet.originalTweet.retweets.some((retweet) => retweet.userId === data?.user.id) : tweet.retweets.some((retweet) => retweet.userId === data?.user.id)}
                mutation={retweetMutation}
            />
            {type === "status" ? (
                <>
                    <TweetAction
                        tweetId={tweet.id}
                        icon={<FaRegBookmark />}
                        activeIcon={<FaBookmark />}
                        isActive={tweet.isRetweet ? tweet.originalTweet.bookmarks.some((bookmark) => bookmark.userId === data?.user.id) : tweet.bookmarks.some((bookmark) => bookmark.userId === data?.user.id)}
                        mutation={bookmarkMutation}
                    />
                    <TweetAction
                        tweetId={tweet.id}
                        icon={<FiUpload />}
                    />
                </>
            ) : (
                <div className="flex -space-x-1">
                    <TweetAction
                        tweetId={tweet.id}
                        icon={<FaRegBookmark />}
                        activeIcon={<FaBookmark />}
                        isActive={tweet.isRetweet ? tweet.originalTweet.bookmarks.some((bookmark) => bookmark.userId === data?.user.id) : tweet.bookmarks.some((bookmark) => bookmark.userId === data?.user.id)}
                        mutation={bookmarkMutation}
                    />
                    <TweetAction
                        tweetId={tweet.id}
                        icon={<FiUpload />}
                    />
                </div>
            )}
        </div>
    )
}