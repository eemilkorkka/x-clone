"use client";
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisplayContextProvider from "@/Context/DisplayContext";
import QueryKeysContextProvider from "@/Context/QueryKeysContext";
import PostDialogContextProvider from "@/Context/PostDialogContext";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <DisplayContextProvider>
                    <QueryKeysContextProvider>
                        <PostDialogContextProvider>
                            {children}
                        </PostDialogContextProvider>
                    </QueryKeysContextProvider>
                </DisplayContextProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default Providers;