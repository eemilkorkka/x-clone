"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type TweetsContextType = {
    tweets: TweetData[];
    postDialogOpen: boolean;
    setPostDialogOpen: Dispatch<SetStateAction<boolean>>;
    setTweets: Dispatch<SetStateAction<TweetData[]>>;
}

export const TweetsContext = createContext<undefined | TweetsContextType>(undefined);

export default function TweetsContextProvider({ children }: { children: ReactNode }) {
    const [tweets, setTweets] = useState<TweetData[]>([]);
    const [postDialogOpen, setPostDialogOpen] = useState<boolean>(false);

    return (
        <TweetsContext.Provider value={{ tweets, setTweets, postDialogOpen, setPostDialogOpen }}>
            {children}
        </TweetsContext.Provider>
    );
}