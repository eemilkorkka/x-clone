"use client";

import { useComposeModal } from "@/components/ComposeModalContext";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";

import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Tweet } from "@/components/Tweet/Tweet";
import { TweetForm } from "@/components/Tweet/TweetForm";
import { useState } from "react";

export default function ComposeModal() {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const { tweetToReplyTo, setTweetToReplyTo } = useComposeModal();

    const handleOpenChange = () => {
        setOpen((prev) => !prev);
        router.back();
        setTweetToReplyTo(null);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent style={{ maxWidth: "600px"}} className="h-full sm:h-fit flex flex-col p-2 rounded-xl ring-0 gap-0" showCloseButton={false}>
                <DialogHeader>
                    <Button size="icon-lg" variant="ghost" className="hover:cursor-pointer rounded-full" onClick={handleOpenChange}>
                        <IoMdClose className="w-30 h-30" />
                    </Button>
                </DialogHeader>
                {tweetToReplyTo && <Tweet type="tweet" tweet={tweetToReplyTo} useLink={false} isComposeModal={true} isParentTweet={true} />}
                {tweetToReplyTo ? (
                    <TweetForm type="reply" parentTweetId={tweetToReplyTo.id} isComposeModal={true} />
                ) : (
                    <TweetForm type="tweet" isComposeModal={true} />
                )}
            </DialogContent>
        </Dialog>
    )
}