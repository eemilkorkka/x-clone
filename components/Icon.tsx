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
        <div className={cn(`group rounded-full w-7 h-7 flex items-center justify-center ${colors.textColor} ${colors.secondHoverColor} hover:cursor-pointer ${colors.svgHoverColor}`, styles)} onClick={onClick}>
            {children}
        </div>
    )
}