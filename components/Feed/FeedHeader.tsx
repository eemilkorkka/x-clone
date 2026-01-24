import React from "react"
import { cn } from "@/lib/utils";

interface FeedHeaderProps {
    children: React.ReactNode;
    styles?: string;
}

export const FeedHeader = ({ children, styles }: FeedHeaderProps) => {
    return (
        <div className={cn("flex sticky top-0 min-h-13 border-b border-border bg-background z-20", styles)}>
            {children}
        </div>
    )
}