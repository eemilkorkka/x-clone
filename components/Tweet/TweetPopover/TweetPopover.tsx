import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import React from "react";
import { TweetPopoverOption } from "./TweetPopoverOption";
import { cn } from "@/lib/utils";

export type PopoverOptionVariant = "destructive" | "default";

type Option = { 
    label: string; 
    icon: React.ReactNode; 
    variant?: PopoverOptionVariant; 
    onClick: () => void; 
}

interface TweetPopoverProps {
    children: React.ReactNode;
    options: Option[];
    styles?: string;
}

export const TweetPopover = ({ children, options, styles }: TweetPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger className={cn("ml-auto", styles)} render={
                <button onClick={(e) => e.stopPropagation()}>
                    {children}
                </button>
            }>
            </PopoverTrigger>
            <PopoverContent className="p-0 drop-shadow-md max-w-50 gap-0 ring-0 overflow-hidden">
                {options.map((option, index) => (
                    <TweetPopoverOption key={index} variant={option.variant} onClick={option.onClick}>
                        {option.icon}
                        {option.label}
                    </TweetPopoverOption>
                ))}
            </PopoverContent>
        </Popover>
    )
}