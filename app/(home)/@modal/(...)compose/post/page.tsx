"use client";

import { useComposeModal } from "@/context/ComposeModalContext";
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

export default function ComposeModal() {
    const router = useRouter();
    const { tweetToReplyTo, setTweetToReplyTo } = useComposeModal();

    const handleOpenChange = () => {
        router.back();
        setTweetToReplyTo(null);
    }

    return (
        <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent className="!max-w-[600px] rounded-none h-full sm:h-fit sm:max-h-[90vh] flex flex-col p-2 sm:rounded-xl ring-0 gap-0" showCloseButton={false}>
                <div className="overflow-y-auto">
                    <DialogHeader className="mb-2">
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
                </div>
            </DialogContent>
        </Dialog>
    )
}