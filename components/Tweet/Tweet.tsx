import { Tweet as TweetType } from "@/types/Tweet";
import { CustomAvatar } from "../User/CustomAvatar";
import { Displayname } from "../User/Displayname";
import { Username } from "../User/Username";
import { useRouter } from "next/navigation";
import { TweetActions } from "./TweetActions";
import { authClient } from "@/lib/auth-client";
import { AiOutlineRetweet } from "react-icons/ai";
import { Text } from "../Text";
import { Media } from "../Media/Media";
import AttachmentsGrid from "./AttachmentsGrid";
import { Icon } from "../Icon";
import { BsThreeDots, BsPin } from "react-icons/bs";
import { IoTrashOutline, IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import { OptionsPopover } from "./TweetPopover/OptionsPopover";
import { useDeleteTweetMutation } from "@/hooks/useDeleteTweetMutation";
import TimeAgo from 'react-timeago';
import { shortFormatter } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { useColor } from "@/context/ColorContext";
import { useFollowMutation } from "@/hooks/useFollowMutation";
import { useToastMessage } from "@/hooks/useToastMessage";

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
    const { toastMessage } = useToastMessage();

    const tweetId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;
    const tweetContent = tweet.isRetweet ? tweet.originalTweet.tweetContent : tweet.tweetContent;
    const tweetFiles = tweet.isRetweet ? tweet.originalTweet.files : tweet.files;
    const tweetAuthor = tweet.isRetweet ? tweet.originalTweet.user : tweet.user;
    const tweetCreatedAt = tweet.isRetweet ? tweet.originalTweet.createdAt : tweet.createdAt;
    
    const { deleteTweetMutation } = useDeleteTweetMutation(tweet.parentTweetId ?? tweetId);
    const { followMutation } = useFollowMutation(
        tweetAuthor?.username ?? "",
        tweetAuthor?.followers?.some(follower => follower.followerId === data?.user.id) ?? false
    );
    const { colors } = useColor();
    const isFollowing = tweetAuthor?.followers?.some(follower => follower.followerId === data?.user.id) ?? false;

    
    const onClick = () => {
        if (useLink) {
            router.push(`/${tweetAuthor?.username}/status/${tweetId}`);
        }
    }

    const avatar = (
        <div className="flex flex-col items-center">
            <CustomAvatar
                src={tweetAuthor?.image ?? ""}
                size="md"
                username={tweetAuthor?.username ?? ""}
                alt={`@${tweetAuthor?.username}`}
                useHoverCard={!isComposeModal}
            />
            {isParentTweet && <hr style={{ width: "2px" }} className="min-h-10 h-full mt-2 mx-auto bg-zinc-300"></hr>}
        </div>
    );

    const ownTweetOptions = [
        {
            label: "Delete",
            icon: <IoTrashOutline />,
            variant: "destructive",
            onClick: () => deleteTweetMutation.mutate(tweetId)
        },
        {
            label: "Pin to your profile",
            icon: <BsPin />,
            onClick: () => toastMessage("This feature hasn't been implemented yet!", false)
        }
    ];

    const generalTweetOptions = [
        {
            label: `${isFollowing ? "Unfollow" : "Follow"} @${tweet.user?.username}`,
            icon: isFollowing ? <IoPersonRemove /> : <IoPersonAdd />,
            onClick: () => followMutation.mutate(tweetAuthor?.id ?? "")
        }
    ];

    return (
        <div className={cn(
            "p-4",
            type !== "status" && !isParentTweet && !isComposeModal && "border-b",
            useLink && "hover:cursor-pointer hover:bg-ring/10 dark:hover:bg-inherit"
        )}>
            {tweet.isRetweet && (
                <p className="flex gap-1 items-center text-[13px] font-semibold text-ring pb-2">
                    <AiOutlineRetweet className="text-ring" size={16} /> {tweet.user?.username === data?.user.username ? "You" : tweet.user?.username} reposted
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
                                <Displayname
                                    username={tweetAuthor?.username ?? ""}
                                    displayName={tweetAuthor?.displayUsername ?? ""}
                                    styles="ml-2"
                                    useHoverCard={!isComposeModal}
                                />
                                <Username username={tweetAuthor?.username ?? ""} useHoverCard={!isComposeModal} />
                            </>
                        ) : (
                            <div className="mb-4">
                                <Displayname
                                    username={tweetAuthor?.username ?? ""}
                                    displayName={tweetAuthor?.displayUsername ?? ""}
                                    styles="ml-2"
                                    useHoverCard={!isComposeModal}
                                />
                                <Username
                                    username={tweetAuthor?.username ?? ""}
                                    styles="ml-2 -mt-1"
                                    useHoverCard={!isComposeModal}
                                />
                            </div>
                        )}
                        {type === "tweet" && (
                            <>
                                <span className="text-zinc-500">·</span>
                                <time className="text-sm text-zinc-500 hover:underline" dateTime={new Date(tweetCreatedAt).toISOString()} title={new Date(tweetCreatedAt).toLocaleString()}>
                                    <TimeAgo date={new Date(tweetCreatedAt)} formatter={shortFormatter} />
                                </time>
                            </>
                        )}
                        {!isComposeModal && (
                            <OptionsPopover options={tweetAuthor?.id === data?.user.id ? ownTweetOptions : generalTweetOptions}>
                                <Icon styles="text-zinc-500 hover:text-sky-500">
                                    <BsThreeDots />
                                </Icon>
                            </OptionsPopover>
                        )}
                    </div>
                    <Text text={tweetContent ?? ""} styles={cn(type === "status" ? "text-lg" : "-mt-2 ml-2", isComposeModal && "mt-0")} />
                    {tweetFiles.length > 0 && (
                        <AttachmentsGrid>
                            {tweetFiles.map((file, index) => (
                                <Media key={file.id} type={file.type} url={file.url} />
                            ))}
                        </AttachmentsGrid>
                    )}
                    {isComposeModal && isParentTweet && (
                        <span
                            className="text-zinc-500 ml-2">Replying to <span className={colors.textColor}>@{tweet.user?.username}</span>
                        </span>
                    )}
                    {type === "status" && (
                        <time className="pt-2 flex items-center text-zinc-500 text-[15px] hover:underline" dateTime={new Date(tweetCreatedAt).toISOString()} title={new Date(tweetCreatedAt).toLocaleString()}>
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
                        </time>
                    )}
                    {type === "tweet" && !isComposeModal && <TweetActions type="tweet" tweet={tweet} />}
                </div>
            </div>
        </div>
    )
}