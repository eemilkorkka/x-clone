"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useColor } from "@/context/ColorContext";

interface IconsProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    styles?: string;
}

export const Icon = ({ children, onClick, styles }: IconsProps) => {

    const { colors } = useColor();

    return (
        <div className={cn(`group rounded-full w-fit h-fit ${colors.textColor} ${colors.secondHoverColor} hover:cursor-pointer hover:[&_svg]:${colors.textColor} p-2`, styles)} onClick={onClick}>
            {children}
        </div>
    )
}