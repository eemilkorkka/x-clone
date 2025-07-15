"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type PostDialogContextType = {
    postDialogOpen: boolean;
    setPostDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const PostDialogContext = createContext<undefined | PostDialogContextType>(undefined);

export default function PostDialogContextProvider({ children }: { children: ReactNode }) {
    const [postDialogOpen, setPostDialogOpen] = useState<boolean>(false);

    return (
        <PostDialogContext.Provider value={{ postDialogOpen, setPostDialogOpen }}>
            {children}
        </PostDialogContext.Provider>
    );
}