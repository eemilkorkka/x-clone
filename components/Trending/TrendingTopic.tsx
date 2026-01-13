import { BsThreeDots } from "react-icons/bs";
import { Icon } from "../Icon";

interface TrendingTopicProps {
    category: string;
    title: string;
    postsCount: string; 
}

export const TrendingTopic = ({ category, title, postsCount }: TrendingTopicProps) => {
    return (
        <div className="px-4 py-2 hover:bg-gray-100 hover:cursor-pointer">
            <div className="flex items-center">
                <span className="flex-1 text-sm text-zinc-500">
                    {category}
                </span>
                <Icon>
                    <BsThreeDots size={16} className="text-zinc-500 peer-hover:text-sky-500 hover:cursor-pointer" />
                </Icon>
            </div>
            <p className="font-bold text-base -mt-2">{title}</p>
            <span className="text-zinc-500">{postsCount} posts</span>
        </div>
    )
}