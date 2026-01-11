import React from "react";
import { cn } from "@/lib/utils";

interface IconsProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    styles?: string;
}

export const Icon = ({ children, onClick, styles }: IconsProps) => {
    return (
        <div className={cn("rounded-full w-fit h-fit text-sky-500 hover:bg-sky-500/20 hover:cursor-pointer p-2", styles)} onClick={onClick}>
            {children}
        </div>
    )
}