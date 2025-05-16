"use client";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ReactNode, useContext } from "react";
import { IoClose } from "react-icons/io5";
import TweetBox from "@/components/TweetBox/TweetBox";
import { TweetsContext } from "@/Context/TweetsContext";

interface PostButtonDialogProps {
    children: ReactNode;
}

const PostButtonDialog = ({ children }: PostButtonDialogProps) => {
    const { postDialogOpen, setPostDialogOpen } = useContext(TweetsContext)!;

    return (
        <Dialog.Root open={postDialogOpen}>
            <Dialog.Trigger asChild onClick={() => setPostDialogOpen(true)}>
                {children}
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-20"/>
            <Dialog.Content className="w-full h-full sm:h-fit top-0 sm:w-[600px] bg-white z-20 fixed left-1/2 sm:top-13 -translate-x-1/2 sm:rounded-2xl">
                <VisuallyHidden.Root>
                    <Dialog.Title />
                </VisuallyHidden.Root>
                <Dialog.Close asChild className="ml-2 mt-1.5 hover:cursor-pointer" onClick={() => setPostDialogOpen(false)}>
                    <button className="rounded-full p-1.5 hover:bg-gray-200">
                        <IoClose size={23}/>
                    </button>
                </Dialog.Close>
                <TweetBox alwaysShowBorder={true} minRows={3} type="tweet" />
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default PostButtonDialog;