import React from "react"
import { twMerge } from "tailwind-merge";

interface FeedHeaderProps {
    children: React.ReactNode;
    styles?: string;
}

export const FeedHeader = ({ children, styles }: FeedHeaderProps) => {
    return (
        <div className={twMerge("flex sticky top-0 h-13 border-b border-gray-200", styles)}>
            {children}
        </div>
    )
}