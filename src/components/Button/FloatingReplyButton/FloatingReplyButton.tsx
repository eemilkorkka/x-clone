"use client";
import ReplyDialog from "@/components/Tweet/ReplyDialog";
import Button from "../Button";
import { BsChat } from "react-icons/bs";
import { useContext } from "react";
import { DisplayContext } from "@/Context/DisplayContext";
import { bgColors } from "@/components/Layout/LeftSideBar/DisplayDialog/DisplayDialog";

interface FloatingReplyButtonProps {
    tweetId: string;
}

const FloatingReplyButton = ({ tweetId }: FloatingReplyButtonProps) => {

    const { selectedIndex } = useContext(DisplayContext)!;

    return (
        <div className="mobile:hidden fixed bottom-20 right-5 z-20">
            <ReplyDialog tweetId={tweetId ? parseInt(tweetId) : undefined}>
                <Button styles={`${bgColors[selectedIndex ?? 0].color}`}>
                    <BsChat size={35} className="p-1" />
                </Button>
            </ReplyDialog>
        </div>
    );
}

export default FloatingReplyButton;