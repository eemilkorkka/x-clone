import { tweetStatType } from "@/types/tweetStatType";
import TweetStat from "./TweetStat";

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

interface TweetStatsProps {
    tweetId: number;
    statValues: number[];
    likes: { UserID: number }[];
    bookmarks: { UserID: number }[];
    retweets: { UserID: number }[];
    style?: string;
}

const TweetStats = ({ style, tweetId, statValues, likes, bookmarks, retweets }: TweetStatsProps) => {
    return (
        <div className={`justify-between ${style}`}>
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
                        bookmarks={bookmarks}
                        retweets={retweets}
                    />
                );
            })}
        </div>
    )
}

export default TweetStats;