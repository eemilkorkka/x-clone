export type tweetStatType = {
    type: "reply" | "retweet" | "like" | "bookmark";
    hoverBgColor?: string;
    hoverTextColor?: string;
    clickedColor?: string;
}