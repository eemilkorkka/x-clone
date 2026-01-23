"use client";

import { colorsArray } from "@/lib/colors";
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
};

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

    useEffect(() => {
        const savedColor = localStorage.getItem("color");

        if (savedColor) {
            setColors(JSON.parse(savedColor));
        }
    }, []);

    return (
        <ColorContext.Provider value={{ colors, setColors }}>
            {children}
        </ColorContext.Provider>
    )
}