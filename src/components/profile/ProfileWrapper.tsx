"use client";
import { useEffect, useState } from "react";
import TabSwitcher from "@/components/shared/TabSwitcher";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import Tweet from "../home/Tweet/Tweet";
import { timeAgo } from "@/utils/utilFunctions";

interface ProfileWrapperProps {
    username: string;
}

const ProfileWrapper = ({ username }: ProfileWrapperProps) => {

    const [currentTab, setCurrentTab] = useState<number>(0);
    const [tweets, setTweets] = useState<TweetData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const session = useSession();
    const isOwnProfile = username === session.data?.user?.username;

    const profileTabs = [
        "Posts",
        "Replies",
        "Media",
        "Likes"
    ];

    useEffect(() => {
        const fetchTweets = async () => {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/posts/${username}`);
            const tweets = await response.json();
            setTweets(tweets);
            setLoading(false);
        }

        fetchTweets();
    }, []);

    return (
        <>
            <TabSwitcher 
                tabs={isOwnProfile ? profileTabs : profileTabs.slice(0, profileTabs.length - 1)} 
                currentTab={currentTab} 
                setCurrentTab={setCurrentTab}
                style={"static! border-b-0!"} 
            />
            {loading ? (
                <div className="flex justify-center mt-10 w-full">
                    <LoadingSpinner variant="blue" />
                </div>
            ) : (
                tweets.map((tweet, index) => {
                    return (
                        <Tweet 
                            key={index}
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
                            timeStamp={timeAgo(tweet.created_at)}
                            statValues={[0,0,0]}
                        />
                    );
                })
            )}
        </>
    );
}

export default ProfileWrapper;