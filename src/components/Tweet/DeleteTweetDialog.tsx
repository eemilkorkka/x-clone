"use client";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";
import Button from "../Shared/Button";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteTweetDialogProps {
    children: ReactNode
    tweetId: number;
    onDelete?: () => void;
}

const DeleteTweetDialog = ({ children, tweetId, onDelete }: DeleteTweetDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const deleteTweet = async () => {
        const response = await fetch(`/api/posts?tweetId=${tweetId}`, {
            method: "DELETE"
        });

        const json = await response.json();

        if (response.ok) {
            onDelete?.();
            queryClient.removeQueries();
            setOpen(false);
            toast.success(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        } else {
            toast.error(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        }
    }

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
                            <Button variant="red" onClick={(e) => { e.stopPropagation(); deleteTweet(); }}>Delete</Button>
                            <Button
                                variant="outline"
                                style="text-black! border-gray-300!"
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