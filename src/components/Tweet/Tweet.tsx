"use client";
import ProfilePicture from "../Profile/ProfilePicture";
import TweetStat from "./TweetStat";
import { tweetStatType } from "@/types/tweetStatType";
import { tweetContentType } from "@/types/tweetContentType";
import { BsThreeDots } from "react-icons/bs";
import Icon from "../TweetBox/Icon";
import AttachmentsGrid from "./AttachmentsGrid";
import Media from "./Media";
import Linkify from "@/components/Shared/Linkify";
import Username from "@/components/Profile/Username";
import DisplayName from "@/components/Profile/DisplayName";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/utils/utilFunctions";

type tweetType = "status" | "tweet";

interface TweetProps {
    tweetType: tweetType;
    tweetContent: tweetContentType;
    tweetId: number;
    profilePicture: string | undefined;
    displayName: string;
    username: string;
    timeStamp: Date;
    statValues: number[];
    likes: { UserID: number }[];
}

export const tweetStats: tweetStatType[] = [
    {   
        type: "reply",
    },
    {
        type: "retweet",
        hoverBgColor: "hover:bg-xgreen/20",
        hoverTextColor: "group-hover:text-xgreen",
        clickedColor: "text-xgreen",
    },
    {
        type: "like",
        hoverBgColor: "hover:bg-xpink/20",
        hoverTextColor: "group-hover:text-xpink",
        clickedColor: "text-xpink",
    },
    {
        type: "bookmark",
    }
];

const Tweet = ({
    tweetType = "tweet", 
    tweetContent, 
    tweetId, 
    profilePicture, 
    displayName, 
    username, 
    timeStamp, 
    statValues, 
    likes 
}: TweetProps) => {
    
    /* Wrapping the component in a Link tag will cause a hydration error, 
    so we will use the useRouter hook. */
    
    const router = useRouter();

    const usernameElement = (
        <a href={`/${username}`} onClick={(e) => e.stopPropagation()}><Username username={username} showProfileHoverCard={true} /></a>
    );

    const displayNameElement = (
        <a href={`/${username}`} onClick={(e) => e.stopPropagation()}><DisplayName displayName={displayName} username={username} showProfileHoverCard={true} variant="small" /></a>
    );

    return (
        <div 
            className={`${tweetType === "tweet" ? "flex border-t hover:cursor-pointer hover:bg-gray-100" : "flex-col"} p-4 pb-1 border-gray-200`} 
            onClick={() => router.push(`/${username}/status/${tweetId}`)}
        >
            {tweetType === "tweet" ? (
                <ProfilePicture image={profilePicture} href={`/${username}`} username={username} showProfileHoverCard={true} />
            ) : (
                <div className="flex gap-4">
                    <ProfilePicture image={profilePicture} href={`/${username}`} username={username} showProfileHoverCard={true} />
                    <div className="flex flex-col">
                        {displayNameElement}
                        {usernameElement}
                    </div>
                </div>
            )}
            <div className={`flex flex-col ${tweetType !== "status" && "pl-4"} h-full w-full`}>
                <div className={`${tweetType === "status" ? "hidden" : "flex"} justify-between`}>
                    <div className="flex gap-1">
                        {displayNameElement}
                        {usernameElement}
                        <i className="text-gray-500 text-lg">·</i>
                        <span className="text-gray-500 text-[15px] whitespace-nowrap">{timeAgo(timeStamp)}</span>
                    </div>
                    <div className="group">
                        <Icon onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <BsThreeDots className="text-gray-500 group-hover:text-xblue" />
                        </Icon>
                    </div>
                </div>
                <div className={`whitespace-pre-line break-words ${tweetType !== "status" ? "mt-[-5px]" : "mt-4"}`}>
                    { /* Tweets can include links, this component will detect them and turn them into anchor tags. */ }
                    <Linkify text={tweetContent.text} />
                </div>
                {tweetContent.files.length > 0 && (
                    <div className="mt-2">
                        <AttachmentsGrid>
                            {tweetContent.files.map((file, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`relative ${
                                            tweetContent.files.length === 3 && index === 0 ? "row-span-2 h-full" : "h-full"
                                        }`}>
                                            <Media type={file.type} url={file.url} />
                                    </div>      
                                );
                            })}
                        </AttachmentsGrid>
                    </div>
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
                <div className={`flex justify-between ${tweetContent.files.length != 0 ? "mt-2" : ""} ${tweetType === "status" && "border-t border-b border-gray-200 p-2"}`}>
                    {tweetStats.map((stat, index) => {
                        return (
                            <TweetStat 
                                key={index}
                                type={stat.type}
                                tweetId={tweetId}
                                hoverBgColor={stat.hoverBgColor} 
                                hoverTextColor={stat.hoverTextColor}
                                clickedColor={stat.clickedColor}
                                statValue={statValues[index]}
                                likes={likes}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Tweet;