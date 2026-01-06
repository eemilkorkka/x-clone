import { deleteTweet } from "@/app/actions/deleteTweet";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

import { IoTrashOutline, IoPersonAdd } from "react-icons/io5";
import { BsPin } from "react-icons/bs";
import { Button } from "../../ui/button";
import { Session } from "better-auth";
import { UserBase } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import { toastMessage } from "@/lib/toast";
import { getQueryClient } from "@/lib/getQueryClient";
import { TweetPopoverOption } from "./TweetPopoverOption";

interface TweetPopoverProps {
    children: React.ReactNode;
    tweetId: number;
    user: UserBase | undefined;
    session: Session | undefined;
}

export const TweetPopover = ({ children, tweetId, user, session }: TweetPopoverProps) => {

    const queryClient = getQueryClient();

    const deleteTweetMutation = useMutation({
        mutationFn: deleteTweet,
        onSuccess: (ctx) => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
            queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
            toastMessage(ctx.message ?? "asdfsad", true);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "asdfsad", false);
        }
    });

    return (
        <Popover>
            <PopoverTrigger className="ml-auto" render={
                <button onClick={(e) => e.stopPropagation()}>
                    {children}
                </button>
            }>
            </PopoverTrigger>
            <PopoverContent className="p-0 drop-shadow-md max-w-50 gap-0">
                {session && session.userId === user?.id ? (
                    <>
                        <TweetPopoverOption variant="destructive" onClick={() => deleteTweetMutation.mutateAsync(tweetId)}>
                            <IoTrashOutline />
                            Delete
                        </TweetPopoverOption>
                        <TweetPopoverOption onClick={() => toastMessage("Work in progress.", false)}>
                            <BsPin />
                            Pin to your profile
                        </TweetPopoverOption>
                    </>
                ) : (
                    <Button variant="ghost" className="rounded-none justify-start font-bold py-5.5">
                        <IoPersonAdd />
                        Follow @{user?.username}
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    )
}