import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import React from "react";
import { cn } from "@/lib/utils";
import { PopoverOption } from "./PopoverOption";

export type PopoverOptionVariant = "destructive" | "default";

type Option = {
    label: string;
    icon: React.ReactNode;
    variant?: PopoverOptionVariant;
    popoverOption?: React.ReactNode;
    onClick?: () => void;
}

interface OptionsPopoverProps {
    children: React.ReactNode;
    options: Option[];
    styles?: string;
}

export const OptionsPopover = ({ children, options, styles }: OptionsPopoverProps) => {
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
                    option.popoverOption ? (
                        option.popoverOption
                    ) : (
                        <PopoverOption key={index} variant={option.variant} onClick={option.onClick ?? (() => {})}>
                            {option.icon}
                            {option.label}
                        </PopoverOption>
                    )
                ))}
            </PopoverContent>
        </Popover>
    )
}