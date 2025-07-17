"use client";
import ProfilePicture from "../Profile/ProfilePicture";
import { tweetContentType } from "@/types/tweetContentType";
import { BsThreeDots } from "react-icons/bs";
import Icon from "../TweetBox/Icon";
import AttachmentsGrid from "./AttachmentsGrid";
import Media from "../Media/Media";
import Linkify from "@/components/Shared/Linkify";
import Username from "@/components/Profile/Username";
import DisplayName from "@/components/Profile/DisplayName";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/utils/utilFunctions";
import TweetPopover from "./TweetPopover";
import { AiOutlineRetweet } from "react-icons/ai";
import { useSession } from "next-auth/react";
import TweetStats from "./TweetStats";

export type tweetType = "status" | "tweet";

interface TweetProps {
    tweetType: tweetType;
    tweetContent: tweetContentType;
    tweetId: number;
    profilePicture: string | undefined;
    displayName: string;
    username: string;
    timeStamp: Date;
    isParentTweet?: boolean;
    isRetweet?: boolean;
    profile?: string;
    isReplyDialog?: boolean;
    style?: string;
    statValues: number[];
    likes: { UserID: number }[];
    bookmarks: { UserID: number }[];
    retweets: { UserID: number }[];
}

const Tweet = ({
    tweetType = "tweet",
    tweetContent,
    tweetId,
    profilePicture,
    displayName,
    username,
    timeStamp,
    isParentTweet,
    isRetweet,
    profile,
    isReplyDialog,
    style,
    statValues,
    likes,
    bookmarks,
    retweets,
}: TweetProps) => {

    /* Wrapping the component in a Link tag will cause a hydration error, 
    so we will use the useRouter hook. */

    const router = useRouter();
    const { data } = useSession();

    const usernameElement = (
        <a href={`/${username}`} className="truncate" onClick={(e) => e.stopPropagation()}>
            <Username username={username} showProfileHoverCard={true} />
        </a>
    );

    const displayNameElement = (
        <a href={`/${username}`} className="truncate" onClick={(e) => e.stopPropagation()}>
            <DisplayName 
                displayName={displayName} 
                username={username} 
                showUnderlineOnHover={true} 
                showProfileHoverCard={true} 
                variant="small" 
            />
        </a>
    );

    const threeDots = (
        <TweetPopover
            username={username}
            tweetId={tweetId}
            tweetType={tweetType}
        >
            <Icon onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <BsThreeDots className="text-gray-500 group-hover:text-xblue" />
            </Icon>
        </TweetPopover>
    );

    return (
        <div className={`flex flex-col gap-1 ${style} ${tweetType === "tweet" && "border-t hover:cursor-pointer hover:bg-gray-100"} p-4 pb-1 border-gray-200`}>
            {isRetweet && (
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                    <AiOutlineRetweet size={18} />
                    <span className="flex-1">{profile === data?.user.username ? "You reposted" : profile + " reposted"}</span>
                </div>
            )}
            <div
                className={`${tweetType === "tweet" ? "flex" : "flex-col"}`}
                onClick={() => !isReplyDialog && router.push(`/${username}/status/${tweetId}`)}
            >
                {tweetType === "tweet" ? (
                    <div className="flex flex-col items-center">
                        <ProfilePicture image={profilePicture} href={`/${username}`} username={username} showProfileHoverCard={true} />
                        {isParentTweet && (
                            <div className="bg-gray-300 h-full w-0.5"></div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <ProfilePicture image={profilePicture} href={`/${username}`} username={username} showProfileHoverCard={true} />
                        <div className="flex w-full justify-between overflow-hidden">
                            <div className="flex flex-col min-w-0">
                                {displayNameElement}
                                {usernameElement}
                            </div>
                            <div className="h-fit">
                                {threeDots}
                            </div>
                        </div>
                    </div>
                )}
                <div className={`flex flex-col ${tweetType !== "status" && "pl-4"} h-full w-full overflow-hidden`}>
                    <div className={`${tweetType === "status" ? "hidden" : "flex"} justify-between`}>
                        <div className="flex gap-1 min-w-0">
                            {displayNameElement}
                            {usernameElement}
                            <i className="text-gray-500 text-lg">·</i>
                            <span className="text-gray-500 text-[15px] whitespace-nowrap">{timeAgo(timeStamp)}</span>
                        </div>
                        <div className={`${isReplyDialog ? "hidden" : "inline"} group`}>
                            {threeDots}
                        </div>
                    </div>
                    <div className={`whitespace-pre-line break-words ${tweetType !== "status" ? "mt-[-5px]" : "mt-4"}`}>
                        { /* Tweets can include links, this component will detect them and turn them into anchor tags. */}
                        <Linkify text={tweetContent.text} />
                    </div>
                    {tweetContent.files.length > 0 && (
                        <div className="mt-2">
                            <AttachmentsGrid>
                                {tweetContent.files.map((file, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`relative ${tweetContent.files.length === 3 && index === 0 ? "row-span-2 h-full" : "h-full"}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Media type={file.type} url={file.url} />
                                        </div>
                                    );
                                })}
                            </AttachmentsGrid>
                        </div>
                    )}
                    {isReplyDialog && (
                        <span className="text-gray-500 text-[15px] mt-2">Replying to
                            {' '}
                            <Linkify text={`@${username}`} />
                        </span>
                    )}
                    {tweetType === "status" && (
                        <div className="pt-2 flex items-center text-gray-500 text-[15px]">
                            <span>{new Date(timeStamp).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                            })}</span>
                            <span className="mx-2 leading-[15px] text-xl">·</span>
                            <span>{new Date(timeStamp).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        </div>
                    )}
                    <TweetStats
                        tweetId={tweetId}
                        statValues={statValues}
                        likes={likes}
                        bookmarks={bookmarks}
                        retweets={retweets} 
                        style={`${isReplyDialog ? "hidden" : "flex"} ${tweetContent.files.length != 0 ? "mt-2" : ""} 
                        ${tweetType === "status" && "border-t border-b border-gray-200 p-2"}`} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Tweet;