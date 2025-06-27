"use client";
import { Dialog } from "radix-ui";
import { ReactNode, useEffect, useState } from "react";
import { VisuallyHidden } from "radix-ui";
import Tweet from "./Tweet";
import TweetBox from "../TweetBox/TweetBox";
import { IoClose } from "react-icons/io5";
import { TweetData } from "../../types/tweetType";

interface ReplyDialogProps {
    children: ReactNode;
    tweetId: number;
}

const ReplyDialog = ({ children, tweetId }: ReplyDialogProps) => {

    const [tweet, setTweet] = useState<TweetData>();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchParenTweet = async () => {
            setLoading(true);
            const response = await fetch(`/api/posts/${tweetId}`);
            const tweet = await response.json();
            setLoading(false);
            return setTweet(tweet);
        }

        open && fetchParenTweet();
    }, [tweetId, open]);

    return (
        <Dialog.Root open={open}>
            <Dialog.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-20" />
            {!loading && (
                <Dialog.Content
                    className="p-2 w-full h-full sm:h-fit sm:max-h-[90vh] top-0 sm:w-[600px] bg-white z-20 fixed left-1/2 sm:top-13 -translate-x-1/2 sm:rounded-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <VisuallyHidden.Root>
                        <Dialog.Title />
                    </VisuallyHidden.Root>
                    <Dialog.Close asChild className="hover:cursor-pointer text-gray-700">
                        <button className="rounded-full p-1.5 hover:bg-gray-200 outline-0"onClick={() => setOpen(false)}>
                            <IoClose size={23} />
                        </button>
                    </Dialog.Close>
                    <div className="max-h-[calc(90vh-48px)] overflow-y-auto overflow-x-hidden">
                        {tweet && (
                            <Tweet
                                tweetType="tweet"
                                tweetContent={{
                                    text: tweet.Content,
                                    files: tweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                        url: file.File_URL,
                                        type: file.File_Type,
                                    })),
                                }}
                                tweetId={tweet.ID}
                                profilePicture={tweet.users.ProfilePicture}
                                displayName={tweet.users.DisplayName}
                                username={tweet.users.Username}
                                timeStamp={new Date(tweet.created_at)}
                                isParentTweet={true}
                                isReplyDialog={true}
                                style="border-t-0! hover:bg-inherit! hover:cursor-default!"
                                statValues={[tweet.replies.length, 0, tweet.likes.length]}
                                likes={tweet.likes}
                                bookmarks={tweet.bookmarks}
                                retweets={tweet.retweets}
                            />
                        )}
                        <TweetBox
                            type="reply"
                            alwaysShowBorder={false}
                            isReplyDialog={true}
                            parentTweetID={tweetId}
                        />
                    </div>
                </Dialog.Content>
            )}
        </Dialog.Root>
    );
}

export default ReplyDialog;