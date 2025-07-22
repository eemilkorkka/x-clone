"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type DisplayContextType = {
    selectedIndex: number | null;
    setSelectedIndex: Dispatch<SetStateAction<number | null>>;
}

export const DisplayContext = createContext<undefined | DisplayContextType>(undefined);

export default function DisplayContextProvider({ children }: { children: ReactNode }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSelectedIndex(Number(localStorage.getItem("color")) ?? 0);
        }
    }, []);

    if (selectedIndex === null) return null;

    return (
        <DisplayContext.Provider value={{ selectedIndex, setSelectedIndex }}>
            {children}
        </DisplayContext.Provider>
    );
}