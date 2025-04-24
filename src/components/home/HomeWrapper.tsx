"use client";
import { useContext, useEffect, useState } from "react";
import TabSwitcher from "../shared/TabSwitcher";
import TweetBox from "./TweetBox/TweetBox";
import Tweet from "./Tweet/Tweet";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { timeAgo } from "@/utils/utilFunctions";
import { TweetsContext } from "@/context/TweetsContext";

const HomeWrapper = () => {
    const tabs: string[] = ["For you", "Following"];
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { tweets, setTweets } = useContext(TweetsContext)!;

    useEffect(() => {
        const fetchTweets = async () => {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/posts");
            const tweets = await response.json();
            setTweets(tweets);
            setLoading(false);
        }

        fetchTweets();
    }, [])
    
    return (
        <>
            <TabSwitcher tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <TweetBox />
            {loading ? (
                <div className="flex justify-center mt-10 w-full">
                    <AiOutlineLoading3Quarters className="animate-spin text-xblue" size={30} />
                </div>
            ) : (
                tweets.map((tweet, index) => {
                    return (
                        <Tweet 
                            key={index}
                            username={tweet.users.Username}
                            displayName={tweet.users.DisplayName}
                            profilePicture={tweet.users.ProfilePicture}
                            tweetContent={
                                { 
                                    text: tweet.Content,
                                    files: tweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                        url: file.File_URL,
                                        type: file.File_Type
                                    }))
                                }
                            }
                            timeStamp={timeAgo(tweet.created_at)}
                            statValues={[0,0,0]}
                        />
                    );
                })
            )}
        </>
    );
}

export default HomeWrapper;