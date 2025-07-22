"use client";
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisplayContextProvider from "@/Context/DisplayContext";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <DisplayContextProvider>
                    {children}
                </DisplayContextProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default Providers;