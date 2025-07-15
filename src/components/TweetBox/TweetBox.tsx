"use client";
import { SlPicture, SlLocationPin } from "react-icons/sl";
import { HiOutlineGif } from "react-icons/hi2";
import ProfilePicture from "../Profile/ProfilePicture";
import { RxCalendar } from "react-icons/rx";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import TextareaAutosize from 'react-textarea-autosize';
import Icon from "./Icon";
import React, { ChangeEvent, useRef, useState, useContext, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import Media from "../Media/Media";
import AttachmentsGrid from "../Tweet/AttachmentsGrid";
import { uploadFiles } from "@/utils/utilFunctions";
import IndeterminateProgress from "@/components/ProgressBar/IndeterminateProgress";
import { PostDialogContext } from "@/Context/PostDialogContext";
import Button from "@/components/Shared/Button";
import EmojiPickerPopover from "./EmojiPickerPopover";
import toast from "react-hot-toast";
import { useMutation, useQueryClient, InfiniteData, QueryKey } from "@tanstack/react-query";
import { QueryKeysContext } from "@/Context/QueryKeysContext";
import { TweetData, TweetFile } from "@/types/tweetType";
import { usePathname } from "next/navigation";

export type tweetBoxType = "reply" | "tweet";

interface TweetBoxProps {
    type: tweetBoxType;
    parentTweetID?: number;
    alwaysShowBorder?: boolean;
    minRows?: number;
    isReplyDialog?: boolean;
    isReplyDialogOpen?: boolean;
    setReplyDialogOpen?: Dispatch<SetStateAction<boolean>>;
}

const icons = [
    <HiOutlineGif key={0} />,
    <HiOutlineEmojiHappy key={1} />,
    <RxCalendar key={2} />,
    <SlLocationPin key={3} />
];

const MAX_FILES = 4;
const ALLOWED_TYPES: string[] = ["image/jpeg", "image/png", "image/gif", "image/svg", "image/jfif", "video/mp4"];

const TweetBox =
    ({
        type = "tweet",
        parentTweetID,
        alwaysShowBorder = true,
        minRows,
        isReplyDialog,
        isReplyDialogOpen,
        setReplyDialogOpen
    }: TweetBoxProps) => {

        const [isFocused, setFocused] = useState<boolean>(false);
        const queryClient = useQueryClient();
        const pathname = usePathname();

        const { postDialogOpen, setPostDialogOpen } = useContext(PostDialogContext)!;
        const { queryKeys } = useContext(QueryKeysContext)!;

        const [tweetContent, setTweetContent] = useState({
            text: "",
            files: [] as { url: string, file: File }[],
        });

        const files: { url: string; type: string; }[] = [];

        const postButtonIsDisabled = !tweetContent.text && tweetContent.files.length === 0;
        const { data: session } = useSession();
        const isViewingOwnProfile = pathname.split("/")[1] === session?.user.username;
        const filePickerRef = useRef<HTMLInputElement | null>(null);

        const handleFileAdd = (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;

            const newFiles = [...tweetContent.files];

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

        const { mutate: postTweetMutation, isPending } = useMutation({
            mutationFn: async () => {
                const formData = new FormData();

                if (tweetContent.files.length > 0) {
                    const data = await uploadFiles(tweetContent.files, formData);

                    data.urls?.forEach((url: { url: string; type: string }) => {
                        files.push({ url: url.url, type: url.type });
                    });
                }

                const requestBody = {
                    text: tweetContent.text,
                    userID: parseInt(session?.user.id ?? ""),
                    files: files,
                    ...(parentTweetID && { parentTweetID }),
                };

                const response = await fetch("/api/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                });

                const json = await response.json();
                return json;
            },
            onMutate: async () => {
                await queryClient.cancelQueries({ queryKey: ["tweets", queryKeys.currentTab] });
                await queryClient.cancelQueries({ queryKey: ["replies", parentTweetID] });

                const previousTweets = queryClient.getQueryData<TweetData[]>(["tweets", queryKeys.currentTab]);
                const previousReplies = queryClient.getQueryData<TweetData[]>(["replies", parentTweetID]);
                const previousProfileFeed = queryClient.getQueryData<TweetData[]>(["profileFeed", queryKeys.username, queryKeys.type]);

                const tweetFiles: TweetFile[] = [];

                tweetContent.files.map((file) => {
                    tweetFiles.push({
                        ID: Date.now(),
                        PostID: Date.now(),
                        File_URL: file.url,
                        File_Type: file.file.type.split("/")[0],
                        created_at: Date.now().toString()
                    })
                });

                const newTweet: TweetData = {
                    ID: Date.now(),
                    UserID: parseInt(session?.user.id ?? ""),
                    Content: tweetContent.text,
                    created_at: new Date(Date.now()).toISOString(),
                    users: {
                        Username: session?.user.username ?? "",
                        DisplayName: session?.user.name ?? "",
                        ProfilePicture: session?.user.image ?? ""
                    },
                    files: tweetFiles,
                    likes: [],
                    replies: [],
                    bookmarks: [],
                    retweets: [],
                }

                const updateData = (queryKey: QueryKey) => {
                    queryClient.setQueryData<InfiniteData<TweetData[]>>(queryKey,
                        (old: InfiniteData<TweetData[]> | undefined) => {
                            if (!old) {
                                return { pages: [[newTweet]], pageParams: [] };
                            }

                            const newPages = [...old.pages];
                            newPages[0] = [newTweet, ...newPages[0]];

                            return {
                                ...old,
                                pages: newPages,
                            };
                        }
                    );
                };

                if (type === "tweet") {
                    if (!isViewingOwnProfile) {
                        updateData(["tweets", queryKeys.currentTab])
                        return { previousTweets }
                    }

                    updateData(["profileFeed", queryKeys.username, queryKeys.type]);
                    return { previousProfileFeed }
                } else if (type === "reply") {
                    updateData(["replies", parentTweetID])
                    return { previousReplies }
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ["tweets", queryKeys.currentTab] });
                queryClient.invalidateQueries({ queryKey: ["replies", parentTweetID] });
                
                if (isViewingOwnProfile) {
                    queryClient.invalidateQueries({ queryKey: ["profileFeed", queryKeys.username, queryKeys.type ]});
                }
            },
            onSuccess: (data) => {
                if (postDialogOpen) {
                    setPostDialogOpen(false);
                }

                if (isReplyDialogOpen) {
                    setReplyDialogOpen?.(false);
                }

                toast.success(data.message, {
                    style: {
                        background: "#1D9BF0",
                        color: "white"
                    }
                });
                setTweetContent({ text: "", files: [] });
            },
            onError: (data) => {
                toast.error(data.message, {
                    style: {
                        background: "#1D9BF0",
                        color: "white"
                    }
                });
            }
        });

        return (
            <>
                {isPending && <IndeterminateProgress />}
                <div className="flex p-4 pb-2">
                    <ProfilePicture image={session?.user.image} />
                    <div className={`flex flex-col bg-white ${type === "reply" && !isFocused && !isReplyDialog ? "flex-row justify-between items-center" : ""} pl-1 h-full w-full text-xl`}>
                        <div className="p-1">
                            <TextareaAutosize
                                placeholder={type === "tweet" ? "What's happening?" : "Post your reply"}
                                className="w-full outline-0 resize-none placeholder-gray-600"
                                value={tweetContent.text}
                                minRows={tweetContent.files.length > 0 ? 1 : minRows}
                                maxLength={280}
                                onChange={(e) => setTweetContent({ ...tweetContent, text: e.target.value })}
                                onFocus={() => setFocused(true)}
                            />
                            <AttachmentsGrid>
                                {tweetContent.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className={`relative ${tweetContent.files.length === 3 && index === 0 ? "row-span-2 h-full" : "h-full"
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
                        <div className={`flex ${isFocused && "pt-2"} justify-between ${isFocused && alwaysShowBorder ? "border-t mt-8 border-gray-200" : ""}`}>
                            <div className={`${type === "reply" && !isFocused && !isReplyDialog ? "hidden" : "flex"} items-center h-full`}>
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
                                            /* TODO: Make this insert the emoji at the current cursor position instead of just
                                                inserting at the end of the tweet
                                            */
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
                                    onClick={() => postTweetMutation()}
                                    style={`text-sm px-4 py-2 ${postButtonIsDisabled ? "opacity-50" : ""}`}>
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