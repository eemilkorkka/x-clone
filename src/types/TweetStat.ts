export type TweetStatType = {
    type: "reply" | "retweet" | "like" | "bookmark";
    hoverBgColor?: string;
    hoverTextColor?: string;
    clickedColor?: string;
}