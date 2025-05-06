import ProfilePicture from "../../shared/ProfilePicture";
import TweetStat from "./TweetStat";
import { tweetStatType } from "@/types/tweetStatType";
import { tweetContentType } from "@/types/tweetContentType";
import { BsThreeDots } from "react-icons/bs";
import Icon from "../TweetBox/Icon";
import AttachmentsGrid from "./AttachmentsGrid";
import Media from "./Media";
import Linkify from "@/components/shared/Linkify";
import ProfileHoverCard from "@/components/Profile/ProfileHoverCard";
import Username from "@/components/Profile/Username";
import DisplayName from "@/components/Profile/DisplayName";

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
        <div className="flex p-4 pb-1 border-t last:border-b border-gray-200 hover:cursor-pointer hover:bg-gray-100">
            <ProfilePicture image={profilePicture} href={username} username={username} showProfileHoverCard={true} />
            <div className="flex flex-col pl-4 h-full w-full">
                <div className="flex justify-between">
                    <div className="flex gap-1">
                        { /*TODO: Get rid of ProfileHoverCard components here and include them in the DisplayName and Username components.*/ }
                        <ProfileHoverCard username={username}>
                            <a href={username}><DisplayName displayName={displayName} variant="small" /></a>
                        </ProfileHoverCard>
                        <ProfileHoverCard username={username}>
                            <a href={username}><Username username={username} /></a>
                        </ProfileHoverCard>
                        <i className="text-gray-500">·</i>
                        <span className="text-gray-500 text-[15px] whitespace-nowrap">{timeStamp}</span>
                    </div>
                    <div className="group">
                        <Icon>
                            <BsThreeDots className="text-gray-500 group-hover:text-xblue" />
                        </Icon>
                    </div>
                </div>
                <div className="whitespace-pre-line break-words mt-[-9px]">
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