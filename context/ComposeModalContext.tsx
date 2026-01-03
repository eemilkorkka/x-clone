"use client";

import { Tweet } from "@/types/Tweet";
import React, { createContext, SetStateAction, useState, useContext } from "react";

type ComposeModalContextType = {
    tweetToReplyTo: Tweet | null;
    setTweetToReplyTo: React.Dispatch<SetStateAction<Tweet | null>>;
}

export const ComposeModalContext = createContext<ComposeModalContextType | undefined>(undefined);

export function useComposeModal() {
    const context = useContext(ComposeModalContext);
    
    if (!context) {
        throw new Error("useComposeModal must be used within ComposeModalContextProvider");
    }
    
    return context;
}

export default function ComposeModalContextProvider({ children }: { children: React.ReactNode }) {
    const [tweetToReplyTo, setTweetToReplyTo] = useState<Tweet | null>(null);

    return (
        <ComposeModalContext.Provider value={{ tweetToReplyTo, setTweetToReplyTo }}>
            {children}
        </ComposeModalContext.Provider>
    )
}