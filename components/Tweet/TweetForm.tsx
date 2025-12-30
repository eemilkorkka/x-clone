"use client";

import TextareaAutosize from 'react-textarea-autosize';
import { CircularProgress } from "@/components/customized/progress/progress-10";
import { Icon } from '../Icon';
import { HiOutlineGif } from 'react-icons/hi2';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { RxCalendar } from 'react-icons/rx';
import { SlLocationPin, SlPicture } from 'react-icons/sl';
import { Button } from '../ui/button';
import React, { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { CustomAvatar } from '../User/CustomAvatar';
import { useFilePicker } from '@/hooks/useFilePicker';
import { createTweet } from '@/app/actions/createTweet';
import toast from 'react-hot-toast';
import { getQueryClient } from '@/lib/getQueryClient';

type File = {
    url: string;
    type: string;
}

interface TweetFormProps {
    type: "tweet" | "reply";
    parentTweetId?: number;
    isComposeModal: boolean;
}

const MAX_LENGTH = 280;

export const TweetForm = ({ type, parentTweetId, isComposeModal }: TweetFormProps) => {

    const { data } = authClient.useSession();
    const [tweetContent, setTweetContent] = useState("");
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const { pickedFiles, setPickedFiles, handleFileAdd } = useFilePicker();
    const [state, action] = useActionState(createTweet, null);
    const [textAreaFocused, setTextAreaFocused] = useState(false);
    const queryClient = getQueryClient();

    useEffect(() => {
        if (state?.error) {
            toast.error(state?.error);
        }

        if (state?.success) {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
            toast.success("Post created successfully!");
            setPickedFiles([]);
            setTweetContent("");
        }
    }, [state]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        if (pickedFiles.length > 0) {
            pickedFiles.forEach((pickedFile) => {
                formData.append(`file`, pickedFile.file);
            });
        }

        startTransition(async () => {
            await action(formData);
        });
    }

    return (
        <div className={`p-4 pb-0 flex items-start ${!isComposeModal && "border-b border-gray-200"} max-w-full`}>
            <CustomAvatar src={data?.user.image ?? ""} alt={`@${data?.user.username}`} size="md" styles="mr-2" />
            <form onSubmit={handleSubmit} className="flex flex-col w-full w-full mt-2">
                <TextareaAutosize
                    placeholder={type === "tweet" ? "What's happening?" : "Post your reply"}
                    name="tweetContent" 
                    value={tweetContent}
                    className="border-0 focus:outline-none resize-none text-lg placeholder-gray-500 pb-4 text-wrap"
                    minRows={2}
                    maxLength={MAX_LENGTH}
                    maxRows={50}
                    onChange={(e) => setTweetContent(e.currentTarget.value)}
                    onFocus={() => setTextAreaFocused(true)}
                />
                <div className={`${type === "reply" && !isComposeModal ? (textAreaFocused ? "flex" : "hidden") : "flex"} items-center ${textAreaFocused && !isComposeModal && "border-t-1 border-gray-200"} justify-between`}>
                    <div className='flex'>
                        <Icon onClick={() => filePickerRef.current?.click()}>
                            <SlPicture size={18} />
                            <input
                                type="file"
                                name="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleFileAdd}
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
                    <div className='flex gap-1 items-center'>
                        <CircularProgress
                            value={Math.round(tweetContent.length / MAX_LENGTH * 100)}
                            renderLabel={() => MAX_LENGTH - tweetContent.length}
                            size={tweetContent.length >= 260 ? 55 : 45}
                            strokeWidth={3}
                            showLabel={tweetContent.length >= 260}
                            labelClassName='text-xs text-zinc-500'
                            progressClassName={tweetContent.length >= 260 ? "stroke-yellow-500" : "stroke-sky-500"}
                        />
                        <hr className='h-8.5 w-[1px] bg-zinc-300'></hr>
                        <Button type="submit" disabled={tweetContent.trim() === ""} className="ml-2 rounded-full px-4 font-bold hover:cursor-pointer">Post</Button>
                    </div>
                </div>
                <input className='hidden' name="parentTweetId" defaultValue={parentTweetId} />
            </form>
        </div>
    )
}
