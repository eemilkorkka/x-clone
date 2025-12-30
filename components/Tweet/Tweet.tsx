import { Tweet as TweetType } from "@/types/Tweet";
import { CustomAvatar } from "../User/CustomAvatar";
import { Displayname } from "../User/Displayname";
import { Username } from "../User/Username";
import { useRouter } from "next/navigation";
import { TweetActions } from "./TweetActions";
import { authClient } from "@/lib/auth-client";
import { AiOutlineRetweet } from "react-icons/ai";

interface TweetProps {
    type: "tweet" | "status";
    tweet: TweetType;
    useLink?: boolean;
}

export const Tweet = ({ type, tweet, useLink = true }: TweetProps) => {

    const { data } = authClient.useSession();
    const router = useRouter();
    const tweetId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;

    const onClick = () => {
        if (useLink) {
            router.push(`/${tweet.user.username}/status/${tweetId}`);
        }
    }

    const avatar = (
        <CustomAvatar
            src={tweet.user.image ?? ""}
            size="md"
            username={tweet.user.username ?? ""}
            alt={`@${tweet.user.username}`}
            styles="mr-2.5"
        />
    )

    return (
        <div className={`p-4 ${type !== "status" && "last:border-b"} first:border-0 border-t border-gray-200 ${useLink && "hover:cursor-pointer hover:bg-ring/10"}`}>
            {tweet.isRetweet && (
                <p className="flex gap-1 items-center text-[13px] font-semibold text-zinc-700 pb-2">
                    <AiOutlineRetweet className="text-zinc-700" size={16} /> {tweet.user.username === data?.user.username ? "You" : tweet.user.username} reposted
                </p>
            )}
            <div className="flex" onClick={onClick}>
                {type === "tweet" && (
                    avatar
                )}
                <div className="flex flex-col w-full">
                    <div className="flex gap-1">
                        {type === "status" && (
                            avatar
                        )}
                        {type === "tweet" ? (
                            <>
                                <Displayname username={tweet.user.username ?? ""} displayName={tweet.user.displayUsername ?? ""} />
                                <Username username={tweet.user.username ?? ""} />
                            </>
                        ) : (
                            <div className="flex flex-col mb-2.5">
                                <Displayname username={tweet.user.username ?? ""} displayName={tweet.user.displayUsername ?? ""} />
                                <Username username={tweet.user.username ?? ""} />
                            </div>
                        )}
                        {type === "tweet" && (
                            <>
                                <span className="text-zinc-500">·</span>
                                <time className="text-zinc-500 text-sm" dateTime={tweet.createdAt.toString()}>
                                    {new Date(tweet.createdAt).toLocaleDateString()}
                                </time>
                            </>
                        )}
                    </div>
                    <p className="text-[15px]">{tweet.isRetweet ? tweet.originalTweet.tweetContent : tweet.tweetContent}</p>
                    {type === "status" && (
                        <div className="pt-2 flex items-center text-zinc-500 text-[15px]">
                            <span>{new Date(tweet.createdAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                            })}</span>
                            <span className="mx-2 leading-[15px] text-xl">·</span>
                            <span>{new Date(tweet.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        </div>
                    )}
                    {type === "tweet" && <TweetActions type="tweet" tweet={tweet} />}
                </div>
            </div>
        </div>
    )
}