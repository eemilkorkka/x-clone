import { Tweet as TweetType } from "@/types/Tweet";
import { CustomAvatar } from "../User/CustomAvatar";
import { Displayname } from "../User/Displayname";
import { Username } from "../User/Username";
import { usePathname, useRouter } from "next/navigation";
import { TweetActions } from "./TweetActions";
import { authClient } from "@/lib/auth-client";
import { AiOutlineRetweet } from "react-icons/ai";
import { Text } from "../Text";
import { Media } from "../Media/Media";
import AttachmentsGrid from "./AttachmentsGrid";
import { Icon } from "../Icon";
import { BsThreeDots, BsPin, BsPinFill } from "react-icons/bs";
import { IoTrashOutline, IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import { OptionsPopover } from "./TweetPopover/OptionsPopover";
import { useDeleteTweetMutation } from "@/hooks/Tweet/useDeleteTweetMutation";
import TimeAgo from 'react-timeago';
import { shortFormatter } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { useColor } from "@/context/ColorContext";
import { useFollowMutation } from "@/hooks/useFollowMutation";
import { usePinTweetMutation } from "@/hooks/Tweet/usePinTweetMutation";

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
    const pathname = usePathname();
    
    const tweetId = tweet.isRetweet ? tweet.originalTweetId : tweet.id;
    const tweetContent = tweet.isRetweet ? tweet.originalTweet.tweetContent : tweet.tweetContent;
    const tweetFiles = tweet.isRetweet ? tweet.originalTweet.files : tweet.files;
    const tweetAuthor = tweet.isRetweet ? tweet.originalTweet.user : tweet.user;
    const tweetCreatedAt = tweet.isRetweet ? tweet.originalTweet.createdAt : tweet.createdAt;
    const tweetToPin = tweet.isRetweet ? tweet.originalTweet : tweet;

    const { deleteTweetMutation } = useDeleteTweetMutation(tweet.parentTweetId ?? tweetId);
    const { pinTweetMutation } = usePinTweetMutation(tweetToPin);
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
            {isParentTweet && <hr style={{ width: "2px" }} className="min-h-10 h-full mt-2 mx-auto bg-border"></hr>}
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
            label: tweetToPin.user?.pinnedTweetId === tweetToPin.id ? "Unpin from your profile" : "Pin to your profile",
            icon: <BsPin />,
            onClick: () => pinTweetMutation.mutate(tweetToPin)
        }
    ];

    const generalTweetOptions = [
        {
            label: `${isFollowing ? "Unfollow" : "Follow"} @${tweet.user?.username}`,
            icon: isFollowing ? <IoPersonRemove /> : <IoPersonAdd />,
            onClick: () => followMutation.mutate(tweetAuthor?.id ?? "")
        }
    ];

    const timeStamp = (
        <>
            <span className="text-zinc-500">·</span>
            <time className="text-sm text-zinc-500 hover:underline whitespace-nowrap" dateTime={new Date(tweetCreatedAt).toISOString()} title={new Date(tweetCreatedAt).toLocaleString()}>
                <TimeAgo date={new Date(tweetCreatedAt)} formatter={shortFormatter} />
            </time>
        </>
    );

    return (
        <div className={cn(
            "p-4",
            type !== "status" && !isParentTweet && !isComposeModal && "border-b",
            useLink && "hover:cursor-pointer hover:bg-ring/10 dark:hover:bg-inherit"
        )}>
            {tweet.isRetweet && (
                <p className="flex gap-1 items-center text-[13px] font-semibold text-zinc-600 pb-2">
                    <AiOutlineRetweet className="text-zinc-600" size={16} /> {tweet.user?.username === data?.user.username ? "You" : tweet.user?.username} reposted
                </p>
            )}
            {tweetAuthor?.pinnedTweetId == tweet.id &&  pathname != "/home" && (
                <p className="flex gap-1 items-center text-[13px] font-semibold text-zinc-600 pb-2">
                    <BsPinFill className="text-zinc-600" size={16} /> Pinned 
                </p>
            )}
            <div className="flex" onClick={onClick}>
                {type === "tweet" && (
                    avatar
                )}
                <div className="flex flex-col w-full">
                    <div className="flex">
                        {type === "status" && (
                            avatar
                        )}
                        <div className="xs:flex gap-1 min-w-0">
                            {type === "tweet" ? (
                                <>
                                    <Displayname
                                        username={tweetAuthor?.username ?? ""}
                                        displayName={tweetAuthor?.displayUsername ?? ""}
                                        styles="ml-2"
                                    />
                                    <div className="ml-1.5 mobile:ml-0 flex gap-1 min-w-0">
                                        <Username username={tweetAuthor?.username ?? ""} useHoverCard={!isComposeModal} />
                                        {timeStamp}
                                    </div>
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
                        </div>
                        {!isComposeModal && (
                            <OptionsPopover options={tweetAuthor?.id === data?.user.id ? ownTweetOptions : generalTweetOptions}>
                                <Icon styles="text-zinc-500 hover:text-sky-500">
                                    <BsThreeDots />
                                </Icon>
                            </OptionsPopover>
                        )}
                    </div>
                    <Text text={tweetContent ?? ""} styles={cn(type === "status" ? "text-lg" : "ml-2", isComposeModal && "mt-0")} />
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