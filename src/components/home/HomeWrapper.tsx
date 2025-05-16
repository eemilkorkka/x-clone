"use client";
import { useContext, useEffect, useState } from "react";
import TabSwitcher from "../Shared/TabSwitcher";
import TweetBox from "../TweetBox/TweetBox";
import Tweet from "../Tweet/Tweet";
import { timeAgo } from "@/utils/utilFunctions";
import { TweetsContext } from "@/Context/TweetsContext";
import { LoadingSpinner } from "../Shared/LoadingSpinner";

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
    }, []);

    return (
        <>
            <TabSwitcher 
                tabs={tabs} 
                currentTab={currentTab} 
                setCurrentTab={setCurrentTab} 
                style="bg-white/90! backdrop-blur-sm!" 
            />
            <TweetBox type="tweet" />
            {loading ? (
                <div className="flex justify-center mt-10 w-full">
                    <LoadingSpinner variant="blue" />
                </div>
            ) : (
                tweets.map((tweet) => {
                    return (
                        <Tweet 
                            key={tweet.ID}
                            tweetType="tweet"
                            tweetId={tweet.ID}
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
                            timeStamp={new Date(tweet.created_at!)}
                            statValues={[tweet.replies.length, 0, tweet.likes.length]}
                            likes={tweet.likes}
                        />
                    );
                })
            )}
        </>
    );
}

export default HomeWrapper;