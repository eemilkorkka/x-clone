import { Tweet as TweetType } from "@/types/Tweet";
import { CustomAvatar } from "../User/CustomAvatar";
import { Displayname } from "../User/Displayname";
import { Username } from "../User/Username";
import { useRouter } from "next/navigation";
import { TweetActions } from "./TweetActions";
import { authClient } from "@/lib/auth-client";
import { AiOutlineRetweet } from "react-icons/ai";
import { Text } from "../Text";
import { Media } from "./Media";
import AttachmentsGrid from "./AttachmentsGrid";
import { Icon } from "../Icon";
import { BsThreeDots } from "react-icons/bs";

interface TweetProps {
    type: "tweet" | "status";
    tweet: TweetType;
    useLink?: boolean;
    isComposeModal?: boolean;
    isParentTweet: boolean;
}

export const Tweet = ({ type, tweet, useLink = true, isComposeModal = false, isParentTweet }: TweetProps) => {

    const { data } = authClient.useSession();
    const router = useRouter();
    const tweetId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;

    const onClick = () => {
        if (useLink) {
            router.push(`/${tweet.user?.username}/status/${tweetId}`);
        }
    }

    const avatar = (
        <div className="flex flex-col items-center">
            <CustomAvatar
                src={tweet.user?.image ?? ""}
                size="md"
                username={tweet.user?.username ?? ""}
                alt={`@${tweet.user?.username}`}
            />
            {isParentTweet && <hr style={{ width: "2px" }} className="min-h-10 h-full mt-2 mx-auto bg-zinc-300"></hr>}
        </div>
    );

    return (
        <div className={`p-4 ${type !== "status" && !isParentTweet && !isComposeModal && "border-b"} ${isComposeModal && "first:border-b border-gray-200"} ${useLink && "hover:cursor-pointer hover:bg-ring/10"}`}>
            {tweet.isRetweet && (
                <p className="flex gap-1 items-center text-[13px] font-semibold text-zinc-700 pb-2">
                    <AiOutlineRetweet className="text-zinc-700" size={16} /> {tweet.user?.username === data?.user.username ? "You" : tweet.user?.username} reposted
                </p>
            )}
            <div className="flex" onClick={onClick}>
                {type === "tweet" && (
                    avatar
                )}
                <div className="flex flex-col w-full min-w-0">
                    <div className="flex gap-1 min-w-0">
                        {type === "status" && (
                            avatar
                        )}
                        {type === "tweet" ? (
                            <>
                                <Displayname username={tweet.user?.username ?? ""} displayName={tweet.user?.displayUsername ?? ""} styles="ml-2" />
                                <Username username={tweet.user?.username ?? ""} />
                            </>
                        ) : (
                            <div className="flex flex-col mb-2.5">
                                <Displayname username={tweet.user?.username ?? ""} displayName={tweet.user?.displayUsername ?? ""} styles="ml-2" />
                                <Username username={tweet.user?.username ?? ""} styles="ml-2" />
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
                        <Icon styles="ml-auto text-zinc-500 hover:text-sky-500" onClick={(e) => e.stopPropagation()}>
                            <BsThreeDots />
                        </Icon>
                    </div>
                    <Text text={tweet.isRetweet ? tweet.originalTweet.tweetContent ?? "" : tweet.tweetContent ?? ""} />
                    {tweet.files.length > 0 && (
                        <AttachmentsGrid>
                            {tweet.files.map((file, index) => (
                                <Media key={file.id} type={file.type} url={file.url} />
                            ))}
                        </AttachmentsGrid>
                    )}
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
                    {type === "tweet" && !isComposeModal && <TweetActions type="tweet" tweet={tweet} />}
                </div>
            </div>
        </div>
    )
}