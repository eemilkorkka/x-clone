import { Button } from "@/components/ui/button"
import React from "react"
import { twMerge } from "tailwind-merge";
import { DeleteTweetDialog } from "./DeleteTweetDialog";

interface TweetPopoverOptionProps {
    children: React.ReactNode;
    variant?: "default" | "destructive";
    onClick: () => void;
}

const baseClass = "w-full rounded-none justify-start font-bold py-5.5 hover:cursor-pointer";

const variants = {
    "destructive": `${baseClass} text-destructive hover:text-destructive`,
    "default": baseClass
}

export const TweetPopoverOption = ({ children, variant = "default", onClick }: TweetPopoverOptionProps) => {

    if (variant === "destructive") {
        return (
            <DeleteTweetDialog onConfirmClick={onClick}>
                <Button variant="ghost" className={variants[variant]}>
                    {children}
                </Button>
            </DeleteTweetDialog>
        )
    }

    return (
        <Button variant="ghost" className={variants[variant]} onClick={(e) => { e.stopPropagation(); onClick();}}>
            {children}
        </Button>
    )
}