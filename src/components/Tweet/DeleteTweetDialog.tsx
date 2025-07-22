"use client";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ReactNode, useContext, useState } from "react";
import toast from "react-hot-toast";
import Button from "../Button/Button";
import { usePathname, useRouter } from "next/navigation";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeysContext } from "@/Context/QueryKeysContext";
import { tweetType } from "./Tweet";
import { TweetData } from "@/types/tweetType";
import { useSession } from "next-auth/react";

interface DeleteTweetDialogProps {
    children: ReactNode
    tweetId: number;
    tweetType: tweetType;
}

const DeleteTweetDialog = ({ children, tweetId, tweetType }: DeleteTweetDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const { data } = useSession();
    const queryClient = useQueryClient();
    const { queryKeys } = useContext(QueryKeysContext)!;

    const isViewingOwnProfile = pathname.split("/")[1] === data?.user.username;
    const isViewingBookmarks = pathname.split("/")[1] === "bookmarks";

    const deleteTweet = async () => {
        const response = await fetch(`/api/posts?tweetId=${tweetId}`, {
            method: "DELETE"
        });

        const json = await response.json();
        return json;
    }

    const { mutate: deleteTweetMutation } = useMutation({
        mutationFn: deleteTweet,
        onMutate: async () => {
            await queryClient.invalidateQueries({ queryKey: ["tweets", queryKeys.currentTab] });
            await queryClient.invalidateQueries({ queryKey: ["replies", queryKeys.parentTweetID] });

            const updateData = (queryKey: QueryKey) => {
                queryClient.setQueryData<InfiniteData<TweetData[]>>(queryKey,
                    (old: InfiniteData<TweetData[]> | undefined) => {
                        if (!old) {
                            return { pages: [], pageParams: [] };
                        }

                        const newPages = old.pages.map(page =>
                            page.filter(tweet => tweet.ID !== tweetId)
                        );

                        return {
                            ...old,
                            pages: newPages,
                        };
                    }
                );
            };

            if (tweetType === "status") {
                updateData(["replies", queryKeys.parentTweetID]);
            } else {
                if (!isViewingOwnProfile) {
                    updateData(["tweets", queryKeys.currentTab]);
                } else if (!isViewingBookmarks) {
                    updateData(["profileFeed", queryKeys.username, queryKeys.type]);
                }

                updateData(["bookmarks"]);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tweets", queryKeys.currentTab] });
            queryClient.invalidateQueries({ queryKey: ["replies", queryKeys.parentTweetID] });
            queryClient.invalidateQueries({ queryKey: ["profileFeed", queryKeys.username, queryKeys.type] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            router.refresh();
        },
        onSuccess: (data) => {
            setOpen(false);
            toast.success(data.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
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
        <Dialog.Root open={open}>
            <Dialog.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-50">
                    <Dialog.Content className="flex flex-col gap-4 w-80 bg-white rounded-2xl p-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <VisuallyHidden.Root>
                            <Dialog.Title></Dialog.Title>
                        </VisuallyHidden.Root>
                        <div className="flex flex-col gap-2">
                            <span className="font-bold text-xl">Delete post?</span>
                            <p className="text-gray-500 text-[15px]">
                                {`This can't be undone and it will be removed from your profile, 
                                the timeline of any accounts that follow you, 
                                and from Twitter search results.`}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="red" onClick={(e) => { e.stopPropagation(); deleteTweetMutation(); }}>Delete</Button>
                            <Button
                                variant="outline"
                                styles="text-black! border-gray-300!"
                                hoverColor="gray"
                                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default DeleteTweetDialog;