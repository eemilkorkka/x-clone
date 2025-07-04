"use server";
import Icon from "../TweetBox/Icon";
import { BsThreeDots } from "react-icons/bs";

interface TrendingItemProps {
    title: string;
    postsAmount?: string;
    category?: string;
}

const TrendingItem = ({ title , postsAmount, category }: TrendingItemProps) => {
    return (
        <div className="flex justify-between p-3.5 hover:bg-gray-100 hover:cursor-pointer">
            <div className="flex flex-col">
                {category ? (
                    <span className="text-gray-500 text-xs">{category} · Trending</span>
                ) : (
                    <span className="text-gray-500 text-xs">Trending in Global</span>
                )}
                <span className="text-md font-semibold">{title}</span>
                { postsAmount && <span className="text-xs text-gray-500">{postsAmount} posts</span> }
            </div>
            <div className="group">
                <Icon>
                    <BsThreeDots className="text-gray-500 group-hover:text-xblue" />
                </Icon>
            </div>
        </div >
    );
}

export default TrendingItem;