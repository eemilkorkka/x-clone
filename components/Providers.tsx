"use client";

import { getQueryClient } from "@/lib/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import ComposeModalContextProvider from "../context/ComposeModalContext";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
                <ComposeModalContextProvider>
                    {children}
                </ComposeModalContextProvider>
            </NuqsAdapter>
        </QueryClientProvider>
    )
}