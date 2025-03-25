import { useState, JSX } from "react";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

interface TweetStatProps {
    type: "reply" | "retweet" | "like" | "bookmark";
    hoverBgColor?: string;
    hoverTextColor?: string;
    clickedColor?: string;
    statValue: number;
}

const TweetStat = ({ type, hoverBgColor, hoverTextColor, clickedColor, statValue }: TweetStatProps) => {
    const [clicked, setClicked] = useState<boolean>(false);

    const types = {
        reply: <FaRegComment size={18} />,
        retweet: <AiOutlineRetweet size={18} />,
        like: clicked ? <GoHeartFill size={18} /> : <GoHeart size={18} />,
        bookmark: clicked ? <IoBookmark size={18} /> : <IoBookmarkOutline size={18} /> 
    };

    const handleStatClick = (type: keyof typeof types) => {
        switch(type) {
            case "reply":
                console.log("reply");
                break;
            case "retweet":
                console.log("retweet");
                break;
            case "like":
                console.log("like");
                break;
            case "bookmark":
                console.log("bookmark");
                break;
        }
    }

    return (
        <div 
            className={`flex items-center text-gray-600 ${clicked && type !== "reply" && (clickedColor ?? "text-xblue")} hover:cursor-pointer`} 
            onClick={() =>  { handleStatClick(type); setClicked(prev => !prev) }}>
                <div className="group flex items-center">
                    <div className={`rounded-full p-2 ${hoverBgColor ? hoverBgColor : "hover:bg-xblue/20"} 
                    ${hoverTextColor ? hoverTextColor : "hover:text-xblue"}`}>
                        {types[type]}
                    </div>
                    { statValue > 0 && 
                        <span className={hoverTextColor ? hoverTextColor : "group-hover:text-xblue"}>
                            {statValue}
                        </span> 
                    }
                </div>
        </div>
    );
}

export default TweetStat;