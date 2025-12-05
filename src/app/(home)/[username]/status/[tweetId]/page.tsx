import Tweet from "@/components/Tweet/Tweet";
import RepliesWrapper from "@/components/Tweet/RepliesWrapper";
import FeedHeader from "@/components/Shared/FeedHeader";
import { getTweetById } from "@/utils/tweet/tweetUtils";
import FloatingReplyButton from "@/components/Button/FloatingReplyButton/FloatingReplyButton";

export default async function Page({ params }: { params: Promise<{ username: string, tweetId: string }> }) {
    const { username, tweetId } = await params;
    let parentTweet = undefined;

    const tweet = await getTweetById(parseInt(tweetId));

    if (tweet?.ParentID) {
        parentTweet = await getTweetById(tweet.ParentID);
    }

    return (
        <>
            <FeedHeader title={tweet ? "Post" : ""} />
            {parentTweet && (
                <Tweet
                    tweetType="tweet"
                    tweetContent={
                        {
                            text: parentTweet.Content,
                            files: parentTweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                url: file.File_URL,
                                type: file.File_Type
                            }))
                        }
                    }
                    tweetId={parentTweet.ID}
                    profilePicture={parentTweet.users.ProfilePicture}
                    displayName={parentTweet.users.DisplayName}
                    username={parentTweet.users.Username}
                    timeStamp={parentTweet.created_at!}
                    isParentTweet={true}
                    statValues={[parentTweet.replies.length, parentTweet.retweets.length, parentTweet.likes.length]}
                    likes={parentTweet.likes}
                    bookmarks={parentTweet.bookmarks}
                    retweets={parentTweet.retweets}
                />
            )}
            {tweet ? (
                <Tweet
                    tweetType="status"
                    tweetContent={
                        {
                            text: tweet.Content,
                            files: tweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                url: file.File_URL,
                                type: file.File_Type
                            }))
                        }
                    }
                    tweetId={parseInt(tweetId)}
                    profilePicture={tweet.users.ProfilePicture}
                    displayName={tweet.users.DisplayName}
                    username={username}
                    timeStamp={tweet.created_at!}
                    statValues={[tweet.replies.length, tweet.retweets.length, tweet.likes.length]}
                    likes={tweet.likes}
                    bookmarks={tweet.bookmarks}
                    retweets={tweet.retweets}
                />
            ) : (
                <div className="flex justify-center">
                    <p className="text-gray-500 p-20">{"Hmm...this page doesn't exist."}</p>
                </div>
            )}
            {tweet && <RepliesWrapper parentTweetID={parseInt(tweetId)} />}
            {tweet && (
                <FloatingReplyButton tweetId={tweetId} />
            )}
        </>
    );
}