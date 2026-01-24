import { Button } from "@/components/ui/button"
import React from "react"
import { DeleteTweetDialog } from "./DeleteTweetDialog";
import { PopoverOptionVariant } from "./OptionsPopover";

interface PopoverOptionProps {
    children: React.ReactNode;
    variant?: PopoverOptionVariant;
    onClick: () => void;
}

const baseClass = "w-full rounded-none justify-start font-bold py-5.5 hover:cursor-pointer";

const variants = {
    "destructive": `${baseClass} text-destructive hover:text-destructive`,
    "default": baseClass
}

export const PopoverOption = ({ children, variant = "default", onClick }: PopoverOptionProps) => {

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