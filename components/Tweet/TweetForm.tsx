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
import { getQueryClient } from '@/lib/getQueryClient';
import { useRouter, useSearchParams } from 'next/navigation';
import AttachmentsGrid from './AttachmentsGrid';
import { Media } from '../Media/Media';
import { IoClose } from 'react-icons/io5';
import { FileType } from '@/generated/prisma/enums';
import { cn } from '@/lib/utils';
import { useGetProfileFeedQueryKey } from '@/hooks/useGetProfileFeedQueryKey';
import { useColor } from '@/context/ColorContext';
import { IntermediateLoading } from '../IntermediateLoading';
import { EmojiPickerPopover } from '../EmojiPickerPopover';
import { useToastMessage } from '@/hooks/useToastMessage';

interface TweetFormProps {
    type: "tweet" | "reply";
    parentTweetId?: number;
    parentTweetAuthor?: string;
    isComposeModal: boolean;
}

const MAX_LENGTH = 280;

export const TweetForm = ({ type, parentTweetId, parentTweetAuthor, isComposeModal }: TweetFormProps) => {

    const { data } = authClient.useSession();
    const [tweetContent, setTweetContent] = useState("");    
    const [textAreaFocused, setTextAreaFocused] = useState(false);
    const [caretPos, setCaretPos] = useState(0);

    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const { pickedFiles, setPickedFiles, handleFileAdd, handleFileRemove } = useFilePicker();
    const [state, action, isPending] = useActionState(createTweet, null);

    const queryClient = getQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { colors } = useColor();
    const { toastMessage } = useToastMessage();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();

    useEffect(() => {
        if (state?.error) {
            toastMessage(state.error, false);
        }

        if (state?.success && state?.success === true) {
            toastMessage(state.message ?? "Post created successfully.", true);
            isComposeModal && router.back();

            if (parentTweetId) {
                queryClient.invalidateQueries({ queryKey: ["tweet", parentTweetId] });
                queryClient.invalidateQueries({ queryKey: ["replies", parentTweetId] });
            }

            queryClient.invalidateQueries({ queryKey: ["tweets", data?.user.id, searchParams.get("feed") ?? "foryou"] });
            queryClient.invalidateQueries({ queryKey: profileFeedQueryKey });

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.currentTarget.form?.requestSubmit()
        }
    }

    return (
        <div>
            {isPending && <IntermediateLoading styles={`${isComposeModal && "mb-4"}`} />}
            {textAreaFocused && parentTweetId && !isComposeModal && type === "reply" && (
                <span
                    className="text-zinc-500 text-sm ml-16 pt-2">Replying to <span className={colors.textColor}>@{parentTweetAuthor}</span>
                </span>
            )}
            <div className={cn(
                "p-4 pb-0 flex items-start max-w-full",
                parentTweetId && textAreaFocused && "pt-0",
                !isComposeModal && "border-b border-gray-200",
                isComposeModal && "pt-0"
            )}>
                <CustomAvatar src={data?.user.image ?? ""} alt={`@${data?.user.username}`} size="md" styles="mr-2" useLink={false} />
                <form onSubmit={handleSubmit} className="flex flex-col w-full mt-2">
                    <TextareaAutosize
                        placeholder={type === "tweet" ? "What's happening?" : "Post your reply"}
                        name="tweetContent"
                        value={tweetContent}
                        className="border-0 focus:outline-none resize-none text-lg placeholder-gray-500 text-wrap"
                        maxLength={MAX_LENGTH}
                        minRows={pickedFiles.length > 0 ? 0 : isComposeModal ? (parentTweetId ? 2 : 5) : 2}
                        maxRows={50}
                        onSelect={(e) => setCaretPos(e.currentTarget.selectionStart)}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setTweetContent(e.currentTarget.value)}
                        onFocus={() => setTextAreaFocused(true)}
                    />
                    <AttachmentsGrid>
                        {pickedFiles.map((file, index) => (
                            <Media key={index} type={file.file.type.includes("image") ? FileType.IMAGE : FileType.VIDEO} url={file.url} useDialog={false}>
                                <Button
                                    size="icon-sm"
                                    className="absolute top-2 right-2 bg-black/70 rounded-full hover:cursor-pointer"
                                    onClick={(e) => { handleFileRemove(index); e.stopPropagation(); }}
                                >
                                    <IoClose fill="white" />
                                </Button>
                            </Media>
                        ))}
                    </AttachmentsGrid>
                    <div className={cn(
                        "items-center justify-between",
                        type === "reply" && !isComposeModal ? (textAreaFocused ? "flex" : "hidden") : "flex",
                        textAreaFocused && !isComposeModal && "border-t-1 border-gray-200"
                    )}>
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

                            <EmojiPickerPopover onEmojiSelect={(emoji) => setTweetContent([tweetContent.slice(0, caretPos), emoji, tweetContent.slice(caretPos)].join(""))}>
                                <Icon>
                                    <HiOutlineEmojiHappy size={18} />
                                </Icon>
                            </EmojiPickerPopover>

                            <Icon>
                                <RxCalendar size={18} />
                            </Icon>

                            <Icon>
                                <SlLocationPin size={18} />
                            </Icon>
                        </div>
                        <div className={cn("flex gap-1 items-center mb-2", textAreaFocused && "mt-2")}>
                            {tweetContent.trim().length > 0 && (
                                <>
                                    <CircularProgress
                                        value={Math.round(tweetContent.length / MAX_LENGTH * 100)}
                                        renderLabel={() => MAX_LENGTH - tweetContent.length}
                                        size={tweetContent.length >= 260 ? 55 : 45}
                                        strokeWidth={3}
                                        showLabel={tweetContent.length >= 260}
                                        labelClassName='text-xs text-zinc-500'
                                        progressClassName={tweetContent.length >= 260 ? "stroke-yellow-500" : "stroke-sky-500"}
                                        className="hidden sm:inline"
                                    />
                                    <hr className='hidden sm:inline h-8.5 w-[1px] bg-zinc-300'></hr>
                                </>
                            )}
                            <Button type="submit" disabled={tweetContent.trim() === "" && pickedFiles.length === 0} className="ml-2 rounded-full px-4 font-bold hover:cursor-pointer">Post</Button>
                        </div>
                    </div>
                    <input className='hidden' name="parentTweetId" defaultValue={parentTweetId} />
                </form>
            </div>
        </div>
    )
}
