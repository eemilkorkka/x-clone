"use client";
import { SlPicture, SlLocationPin } from "react-icons/sl";
import { HiOutlineGif } from "react-icons/hi2";
import ProfilePicture from "../../Profile/ProfilePicture";
import { RxCalendar } from "react-icons/rx";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import TextareaAutosize from 'react-textarea-autosize';
import Icon from "./Icon";
import React, { ChangeEvent, useRef, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import Media from "../Tweet/Media";
import AttachmentsGrid from "../Tweet/AttachmentsGrid";
import { uploadFiles } from "@/utils/utilFunctions";
import IndeterminateProgress from "@/components/ProgressBar/IndeterminateProgress";
import { TweetsContext } from "@/context/TweetsContext";
import Button from "@/components/shared/Button";
import EmojiPickerPopover from "./EmojiPickerPopover";

type tweetBoxType = "reply" | "tweet";

interface TweetBoxProps {
    type: tweetBoxType;
    alwaysShowBorder?: boolean;
    minRows?: number;
}

const icons = [
    <HiOutlineGif />,
    <HiOutlineEmojiHappy />,
    <RxCalendar />,
    <SlLocationPin />
]

const MAX_FILES = 4;
const ALLOWED_TYPES: string[] = ["image/jpeg", "image/png", "image/gif", "image/svg", "video/mp4"];

const TweetBox = ({ type = "tweet", alwaysShowBorder = true, minRows }: TweetBoxProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [isFocused, setFocused] = useState<boolean>(false);
    const { setTweets, postDialogOpen, setPostDialogOpen } = useContext(TweetsContext)!;
    const [tweetContent, setTweetContent] = useState({
        text: "",
        files: [] as { url: string, file: File }[],
    });

    const files: { url: string; type: string;}[] = [];

    let postButtonIsDisabled = !tweetContent.text && tweetContent.files.length === 0;
    const { data: session } = useSession();
    const filePickerRef = useRef<HTMLInputElement | null>(null);

    const handleFileAdd = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        let newFiles = [...tweetContent.files];

        for (let i = 0; i < files.length; i++) {
            if (newFiles.length >= MAX_FILES) break;
            
            const file = files[i];

            if (ALLOWED_TYPES.includes(file.type)) {
                const url = URL.createObjectURL(file);
                newFiles.push({ url, file });
            }
        }

        setTweetContent(prev => ({ ...prev, files: newFiles }));
        e.target.value = "";
    }

    const handleFileRemove = (index: number) => {
        const newFiles = [...tweetContent.files];
        const fileToRemove = newFiles[index];

        URL.revokeObjectURL(fileToRemove.url);
        newFiles.splice(index, 1);

        setTweetContent?.((prev) => ({ ...prev, files: newFiles }));
    }

    const handlePostTweet = async () => {
        setLoading(true);

        const formData = new FormData();

        if (tweetContent.files.length > 0) {
            const data = await uploadFiles(tweetContent.files, formData);

            data.urls?.forEach((url: { url: string; type: string }) => {
                files.push({ url: url.url, type: url.type });
            });
        }

        const response = await fetch("http://localhost:3000/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: tweetContent.text, userID: parseInt(session?.user.id!), files: files })
        });

        const json = await response.json();

        setTweets(prev => [json.post, ...prev]);
        setLoading(false);
        postDialogOpen && setPostDialogOpen(false);
        setTweetContent({ text: "", files: [] });
    }

    return (
        <>
            { loading && <IndeterminateProgress /> }
            <div className="flex p-4 pb-2">
                <ProfilePicture image={session?.user.image} />
                <div className={`flex flex-col ${type === "reply" && !isFocused ? "flex-row justify-between items-center" : ""} pl-1 h-full w-full text-xl`}>
                    <div className="p-1">
                        <TextareaAutosize 
                            placeholder={type === "tweet" ? "What's happening?" : "Post your reply"} 
                            className="w-full outline-0 resize-none placeholder-gray-600"
                            value={tweetContent.text}
                            minRows={tweetContent.files.length > 0 ? 1 : minRows}
                            onChange={(e) => setTweetContent({ ...tweetContent, text: e.target.value })}
                            onFocus={() => setFocused(true)}
                        />
                        <AttachmentsGrid>
                            {tweetContent.files.map((file, index) => (
                                <div
                                    key={index}
                                    className={`relative ${
                                        tweetContent.files.length === 3 && index === 0 ? "row-span-2 h-full" : "h-full"
                                    }`}>
                                        <Media type={file.file.type} url={file.url}>
                                            <button
                                                className="absolute top-1 right-1 bg-black/70 p-1 rounded-full hover:cursor-pointer"
                                                onClick={() => handleFileRemove(index)}
                                            >
                                                <IoClose size="23" fill="white" />
                                            </button>
                                        </Media>
                                </div>
                            ))}
                        </AttachmentsGrid>
                    </div>
                    <div className={`flex pt-2.5 justify-between ${isFocused && alwaysShowBorder ? "border-t mt-8 border-gray-200" : ""}`}>
                        <div className={`${type === "reply" && !isFocused ? "hidden" : "flex"} items-center h-full`}>
                            <Icon onClick={() => tweetContent.files.length < MAX_FILES && filePickerRef.current?.click()}>
                                <SlPicture size={17} />
                                <input 
                                    type="file" 
                                    className="hidden"
                                    ref={filePickerRef} 
                                    onChange={handleFileAdd} 
                                    multiple
                                    accept="image/*,video/*"
                                />
                            </Icon>
                            {icons.map((icon, index) => (
                                <React.Fragment key={index}>
                                    {index === 1 ? (
                                        <EmojiPickerPopover onEmojiClick={(emoji) => setTweetContent(prev => ({ ...prev, text: prev.text + emoji.emoji }))}
                                        >
                                            <Icon>
                                                {icon}
                                            </Icon>
                                        </EmojiPickerPopover>
                                    ) : (
                                        <Icon>
                                            {icon}
                                        </Icon>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex items-center">
                            <Button 
                                disabled={postButtonIsDisabled} 
                                variant="black" 
                                onClick={handlePostTweet}
                                style={`text-sm px-4 pt-2 pb-1.5 ${postButtonIsDisabled ? "opacity-50" : ""}`}>
                                    {type === "tweet" ? "Post" : "Reply"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TweetBox;