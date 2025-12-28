"use client";

import TextareaAutosize from 'react-textarea-autosize';
import { Icon } from './Icon';
import { HiOutlineGif } from 'react-icons/hi2';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { RxCalendar } from 'react-icons/rx';
import { SlLocationPin, SlPicture } from 'react-icons/sl';
import { Button } from './ui/button';
import { useRef, useState } from 'react';

type File = {
    url: string;
    type: string;
}

export const TweetForm = () => {

    const [tweetContent, setTweetContent] = useState({ text: "", files: [] as File[] });
    const filePickerRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="p-4 flex items-start max-w-full border-b border-gray-200">
            <div className="w-10 h-10 shrink-0 rounded-full bg-red-500 mr-2.5"></div>
            <form className="flex flex-col w-full w-full mt-2">
                <TextareaAutosize placeholder="What's happening?" value={tweetContent.text} className="border-0 focus:outline-none resize-none text-lg" minRows={2} onChange={(e) => setTweetContent({ ...tweetContent, text: e.currentTarget.value })} />
                <div className='flex justify-between'>
                    <div className="flex gap-4">
                        <Icon onClick={() => filePickerRef.current?.click()}>
                            <SlPicture size={18} />
                            <input
                                type="file"
                                className="hidden"
                                ref={filePickerRef}
                                multiple
                                accept="image/*,video/*"
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
                    
                    <Button disabled={tweetContent.text.trim() === ""} className="rounded-full px-4 font-bold hover:cursor-pointer">Post</Button>
                </div>
            </form>
        </div>
    )
}
