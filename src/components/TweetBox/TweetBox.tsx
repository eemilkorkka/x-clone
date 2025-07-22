"use client";
import { SlPicture, SlLocationPin } from "react-icons/sl";
import { HiOutlineGif } from "react-icons/hi2";
import ProfilePicture from "../Profile/ProfilePicture";
import { RxCalendar } from "react-icons/rx";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import TextareaAutosize from 'react-textarea-autosize';
import Icon from "./Icon";
import React, { useRef, useState, useContext, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import Media from "../Media/Media";
import AttachmentsGrid from "../Tweet/AttachmentsGrid";
import { uploadFiles } from "@/utils/utilFunctions";
import IndeterminateProgress from "@/components/ProgressBar/IndeterminateProgress";
import { PostDialogContext } from "@/Context/PostDialogContext";
import Button from "@/components/Button/Button";
import EmojiPickerPopover from "./EmojiPickerPopover";
import toast from "react-hot-toast";
import { useMutation, useQueryClient, InfiniteData, QueryKey } from "@tanstack/react-query";
import { QueryKeysContext } from "@/Context/QueryKeysContext";
import { TweetData, TweetFile } from "@/types/tweetType";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MAX_FILES, useFilePicker } from "@/hooks/useFilePicker";

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
        const router = useRouter();
        const pathname = usePathname();

        const { postDialogOpen, setPostDialogOpen } = useContext(PostDialogContext)!;
        const { queryKeys } = useContext(QueryKeysContext)!;

        const [tweetContent, setTweetContent] = useState<string>("");
        const { pickedFiles, handleFileAdd, handleFileRemove } = useFilePicker();

        const files: { url: string; type: string; }[] = [];

        const postButtonIsDisabled = !tweetContent && pickedFiles.length === 0;
        const { data: session } = useSession();

        const isViewingOwnProfile = pathname.split("/")[1] === session?.user.username;
        const isViewingBookmarks = pathname.split("/")[1] === "bookmarks";

        const filePickerRef = useRef<HTMLInputElement | null>(null);

        const { mutate: postTweetMutation, isPending } = useMutation({
            mutationFn: async () => {
                const formData = new FormData();

                if (pickedFiles.length > 0) {
                    const data = await uploadFiles(pickedFiles, formData);

                    data.urls?.forEach((url: { url: string; type: string }) => {
                        files.push({ url: url.url, type: url.type });
                    });
                }

                const requestBody = {
                    text: tweetContent,
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
                const previousBookmarks = queryClient.getQueryData<TweetData[]>(["bookmarks"]);

                const tweetFiles: TweetFile[] = [];

                pickedFiles.map((file) => {
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
                    Content: tweetContent,
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
                        return previousTweets;
                    } else if (!isViewingBookmarks) {
                        updateData(["profileFeed", queryKeys.username, queryKeys.type]);
                        return previousProfileFeed;
                    }

                    updateData(["bookmarks"]);
                    return previousBookmarks;
                } else if (type === "reply") {
                    updateData(["replies", parentTweetID])
                    return previousReplies;
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ["tweets", queryKeys.currentTab] });
                queryClient.invalidateQueries({ queryKey: ["replies", parentTweetID] });
                queryClient.invalidateQueries({ queryKey: ["profileFeed", queryKeys.username, queryKeys.type] });
                queryClient.invalidateQueries({ queryKey: ["bookmarks"] });

                router.refresh();
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
                setTweetContent("");
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
                    <ProfilePicture image={session?.user.image ?? ""} />
                    <div className={`flex flex-col bg-white ${type === "reply" && !isFocused && !isReplyDialog ? "flex-row justify-between items-center" : ""} pl-1 h-full w-full text-xl`}>
                        <div className="p-1">
                            <TextareaAutosize
                                placeholder={type === "tweet" ? "What's happening?" : "Post your reply"}
                                className="w-full outline-0 resize-none placeholder-gray-600"
                                value={tweetContent}
                                minRows={pickedFiles.length > 0 ? 1 : minRows}
                                maxLength={280}
                                onChange={(e) => setTweetContent(e.target.value)}
                                onFocus={() => setFocused(true)}
                            />
                            <AttachmentsGrid>
                                {pickedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className={`relative ${pickedFiles.length === 3 && index === 0 ? "row-span-2 h-full" : "h-full"
                                            }`}>
                                        <Media type={file.file.type} url={file.url}>
                                            <button
                                                className="absolute top-1 right-1 bg-black/70 p-1 rounded-full hover:cursor-pointer"
                                                onClick={(e) => { handleFileRemove(index); e.stopPropagation(); }}
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
                                <Icon onClick={() => pickedFiles.length < MAX_FILES && filePickerRef.current?.click()}>
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
                                            <EmojiPickerPopover onEmojiClick={(emoji) => setTweetContent(prev => prev + emoji.emoji)}
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
                                    styles={`text-sm px-4 py-2 ${postButtonIsDisabled ? "opacity-50" : ""}`}>
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