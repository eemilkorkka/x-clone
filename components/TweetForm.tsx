"use client";

import TextareaAutosize from 'react-textarea-autosize';
import { Icon } from './Icon';
import { HiOutlineGif } from 'react-icons/hi2';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { RxCalendar } from 'react-icons/rx';
import { SlLocationPin, SlPicture } from 'react-icons/sl';
import { Button } from './ui/button';
import { useActionState, useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { CustomAvatar } from './CustomAvatar';
import { useFilePicker } from '@/hooks/useFilePicker';
import { createTweet } from '@/app/actions/createTweet';
import toast from 'react-hot-toast';

type File = {
    url: string;
    type: string;
}

interface TweetFormProps {
    type: "tweet" | "reply";
    parentTweetId?: number;
}

export const TweetForm = ({ type, parentTweetId }: TweetFormProps) => {

    const { data } = authClient.useSession();
    const [tweetContent, setTweetContent] = useState("");
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const { pickedFiles, setPickedFiles, handleFileAdd } = useFilePicker();
    const [state, action] = useActionState(createTweet, null);

    useEffect(() => {
        if (state?.error) {
            toast.error(state?.error);
        }

        if (state?.success) {
            toast.success("Post created successfully!");
            setPickedFiles([]);
            setTweetContent("");
        }
    }, [state]);

    return (
        <div className="p-4 flex items-start max-w-full border-b border-gray-200">
            <CustomAvatar src={data?.user.image ?? ""} alt={`@${data?.user.username}`} size="md" styles="mr-2" />
            <form action={action} className="flex flex-col w-full w-full mt-2">
                <TextareaAutosize placeholder={type === "tweet" ? "What's happening?" : "Post your reply"} name="tweetContent" value={tweetContent} className="border-0 focus:outline-none resize-none text-lg placeholder-gray-500" minRows={2} onChange={(e) => setTweetContent(e.currentTarget.value)} />
                <div className='flex justify-between'>
                    <div className="flex gap-4">
                        <Icon onClick={() => filePickerRef.current?.click()}>
                            <SlPicture size={18} />
                            <input
                                type="file"
                                name="file"
                                accept="image/*,video/*"
                                className="hidden"
                                ref={filePickerRef}
                                multiple
                            />
                        </Icon>

                        <Icon>
                            <HiOutlineGif size={18} />
                        </Icon>

                        <Icon>
                            <HiOutlineEmojiHappy size={18} />
                        </Icon>

                        <Icon>
                            <RxCalendar size={18} />
                        </Icon>

                        <Icon>
                            <SlLocationPin size={18} />
                        </Icon>
                    </div>
                    <Button type="submit" disabled={tweetContent.trim() === ""} className="rounded-full px-4 font-bold hover:cursor-pointer">Post</Button>
                </div>
            </form>
        </div>
    )
}
