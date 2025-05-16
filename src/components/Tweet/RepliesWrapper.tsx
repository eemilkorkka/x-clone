"use client";
import { useState, useEffect } from "react";
import TweetBox from "../TweetBox/TweetBox";
import Tweet from "./Tweet";
import { LoadingSpinner } from "@/components/Shared/LoadingSpinner";

interface RepliesWrapperProps {
    parentTweetID: number;
}

const RepliesWrapper = ({ parentTweetID }: RepliesWrapperProps) => {

    const [loading, setLoading] = useState<boolean>();
    const [replies, setReplies] = useState<TweetData[]>([]);

    useEffect(() => {
        const fetchReplies = async () => {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/posts/replies?tweetId=${parentTweetID}`);
            const replies = await response.json();
            setReplies(replies);
            setLoading(false);
        }

        fetchReplies();
    }, [setReplies]);

    return (
        <>
            <TweetBox type="reply" parentTweetID={parentTweetID} setReplies={setReplies} />
            {loading ? (
                <div className="flex justify-center mt-10 w-full">
                    <LoadingSpinner variant="blue" />
                </div>
            ) : (
                (replies.map((tweet, index) => {
                    return (
                        <Tweet 
                            key={index}
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
                }))
            )}
        </>
    );
}

export default RepliesWrapper;