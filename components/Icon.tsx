import React from "react";
import { twMerge } from "tailwind-merge";

interface IconsProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    styles?: string;
}

export const Icon = ({ children, onClick, styles }: IconsProps) => {
    return (
        <div className={twMerge("rounded-full w-fit h-fit text-sky-500 hover:bg-sky-500/20 hover:cursor-pointer p-2", styles)} onClick={onClick}>
            {children}
        </div>
    )
}