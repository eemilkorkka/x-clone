import { SlPicture, SlLocationPin } from "react-icons/sl";
import { HiOutlineGif } from "react-icons/hi2";
import ProfilePicture from "../../shared/ProfilePicture";
import { RxCalendar } from "react-icons/rx";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import TextareaAutosize from 'react-textarea-autosize';
import Icon from "./Icon";
import { useState } from "react";
import { useSession } from "next-auth/react";

const icons = [
    <SlPicture size={17} />,
    <HiOutlineGif />,
    <HiOutlineEmojiHappy />,
    <RxCalendar />,
    <SlLocationPin />
]

const TweetBox = () => {
    const [isFocused, setFocused] = useState<boolean>(false);
    const [tweetText, setTweetText] = useState<string>("");
    const { data: session } = useSession();

    return (
        <div className="flex p-4 pb-2 border-b border-gray-200">
            <ProfilePicture image={session?.user.image} />
            <div className="flex flex-col pl-1 h-full w-full text-xl">
                <div className="p-1">
                    <TextareaAutosize 
                        placeholder="What's happening?" 
                        className="w-full outline-0 resize-none placeholder-gray-600"
                        value={tweetText}
                        onChange={(e) => setTweetText(e.target.value)}
                        onFocus={() => setFocused(true)} 
                    />
                </div>
                <div className={`flex mt-2 pt-2.5 justify-between ${isFocused && "border-t mt-8 border-gray-200"}`}>
                    <div>
                        <div className="flex items-center h-full">
                            {icons.map((icon, index) => {
                                return (
                                    <Icon key={index}>
                                        {icon}
                                    </Icon>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className={`bg-black ${tweetText === "" ? "opacity-50" : ""} pt-2 px-4 py-1.5 text-[0.8em] text-white font-bold rounded-full`}>
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TweetBox;