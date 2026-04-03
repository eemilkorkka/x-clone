"use client";

import { authClient } from "@/lib/auth-client";
import { colorsArray } from "@/lib/colors";
import { useTheme } from "next-themes";
import React, { createContext, SetStateAction, useState, useContext, useEffect } from "react";

export type ColorsType = {
    color: string;
    hoverColor: string;
    secondHoverColor: string;
    textColor: string;
    focusVisibleBorderColor: string;
    peerFocusTextColor: string;
    svgHoverColor: string;
    hexColor: string;
    checkedColor: string;
    checkedBorderColor: string;
}

type ColorContextType = {
    colors: ColorsType;
    setColors: React.Dispatch<SetStateAction<ColorsType>>;
}

export const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function useColor() {
    const context = useContext(ColorContext);

    if (!context) {
        throw new Error("useColor must be used within ColorContextProvider");
    }

    return context;
}

export default function ColorContextProvider({ children }: { children: React.ReactNode }) {
    const [colors, setColors] = useState<ColorsType>(colorsArray[0]);
    const { setTheme } = useTheme();
    const { data } = authClient.useSession();
    
    useEffect(() => {
        const savedColor = localStorage.getItem("color");

        if (savedColor) {
            setColors(JSON.parse(savedColor));
        }
    }, []);

    useEffect(() => {
        if (data?.session) {
            setTheme(localStorage.getItem("selectedTheme") || "dark");
        } else {
            setTheme("dark");
        }
    }, [data]);


    return (
        <ColorContext.Provider value={{ colors, setColors }}>
            {children}
        </ColorContext.Provider>
    )
}  