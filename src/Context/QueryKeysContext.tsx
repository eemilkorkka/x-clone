"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type QueryKeysContextType = {
    queryKeys: {
        currentTab: number | undefined;
        parentTweetID: number | undefined;
        username: string;
        type: string;
    };
    setQueryKeys: Dispatch<SetStateAction<{
        currentTab: number | undefined;
        parentTweetID: number | undefined;
        username: string;
        type: string;
    }>>;
};

export const QueryKeysContext = createContext<QueryKeysContextType | undefined>(undefined);

export default function QueryKeysContextProvider({ children }: { children: ReactNode }) {
    const [queryKeys, setQueryKeys] = useState<{
        currentTab: number | undefined;
        parentTweetID: number | undefined;
        username: string;
        type: string;
    }>({
        currentTab: undefined, 
        parentTweetID: undefined,  
        username: "",
        type: ""
    });

    return (
        <QueryKeysContext.Provider value={{ queryKeys, setQueryKeys }}>
            {children}
        </QueryKeysContext.Provider>
    );
}
