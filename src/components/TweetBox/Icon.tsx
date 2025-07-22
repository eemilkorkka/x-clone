"use client";
import { DisplayContext } from "@/Context/DisplayContext";
import { ReactNode, useContext } from "react";
import { bgColors, textColors } from "../Layout/LeftSideBar/DisplayDialog/DisplayDialog";

interface IconProps {
    children: ReactNode
    onClick?: (e: React.MouseEvent) => void;
    style?: string;
}

const Icon = ({ children, onClick, style }: IconProps) => {

    const { selectedIndex } = useContext(DisplayContext)!;

    return (
        <div className={`relative ${bgColors[selectedIndex ?? 0].hoverColor} hover:cursor-pointer p-2 rounded-full ${textColors[selectedIndex ?? 0].color} ${style}`} onClick={onClick}>
            {children}
        </div>
    );
}

export default Icon;