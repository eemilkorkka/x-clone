"use client";

import { getQueryClient } from "@/lib/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import ComposeModalContextProvider from "../context/ComposeModalContext";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from "next-themes";
import ColorContextProvider from "@/context/ColorContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
                <ComposeModalContextProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark" themes={["light", "dim", "dark"]}>
                        <ColorContextProvider>
                            {children}
                        </ColorContextProvider>
                    </ThemeProvider>
                </ComposeModalContextProvider>
            </NuqsAdapter>
        </QueryClientProvider>
    )
}