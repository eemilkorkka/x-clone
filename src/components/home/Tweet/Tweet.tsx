import ProfilePicture from "../../shared/ProfilePicture";
import TweetStat from "./TweetStat";
import { tweetStatType } from "@/types/tweetStatType";
import { tweetContentType } from "@/types/tweetContentType";
import AttachmentsGrid from "./AttachmentsGrid";
import Media from "./Attachment";

interface TweetProps {
    tweetContent: tweetContentType;
    profilePicture: string | undefined;
    displayName: string;
    username: string;
    timeStamp: string;
    statValues: number[];
}

const tweetStats: tweetStatType[] = [
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

const Tweet = ({ tweetContent, profilePicture, displayName, username, timeStamp, statValues }: TweetProps) => {
    return (
        <div className="flex p-4 pb-1 border-b border-gray-200 hover:cursor-pointer hover:bg-gray-100">
            <ProfilePicture image={profilePicture} />
            <div className="flex flex-col pl-4 h-full w-full">
                <div className="flex items-center gap-1">
                    <span className="font-bold whitespace-nowrap text-[16px]">{displayName}</span>
                    <span className="text-gray-500 whitespace-nowrap text-[16px]">@{username}</span>
                    <i className="text-gray-500">·</i>
                    <span className="text-gray-500">{timeStamp}</span>
                </div>
                <div>{tweetContent.text}</div>
                {tweetContent.files?.length > 0 && (
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
                <div className={`flex justify-between ${tweetContent.files.length != 0 ? "mt-2" : ""}`}>
                    {tweetStats.map((stat, index) => {
                        return (
                            <TweetStat 
                                key={index}
                                type={stat.type}
                                hoverBgColor={stat.hoverBgColor} 
                                hoverTextColor={stat.hoverTextColor}
                                clickedColor={stat.clickedColor}
                                statValue={statValues[index]} 
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Tweet;