import { useSession } from "next-auth/react";
import ProfilePicture from "../../shared/ProfilePicture";
import TweetStat from "./TweetStat";
import { tweetStatType } from "@/types/tweetStatType";

interface TweetProps {
    content: string;
    displayName: string;
    username: string;
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

const Tweet = ({ content, displayName, username, statValues }: TweetProps) => {
    const { data: session } = useSession();

    return (
        <div className="flex p-4 pb-1 border-b border-gray-200 hover:cursor-pointer hover:bg-gray-100">
            <ProfilePicture image={session?.user.image} />
            <div className="flex flex-col pl-4 h-full w-full">
                <div className="flex gap-1">
                    <span className="font-bold whitespace-nowrap text-[16px]">{displayName}</span>
                    <span className="text-gray-500 whitespace-nowrap text-[16px]">@{username}</span>
                </div>
                <div>{content}</div>
                <div className="flex justify-between mt-2">
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