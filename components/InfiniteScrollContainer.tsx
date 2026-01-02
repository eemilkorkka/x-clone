import React from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps {
    children: React.ReactNode;
    onBottomReached: () => void;
}

export const InfiniteScrollContainer = ({ children, onBottomReached }: InfiniteScrollContainerProps) => {

    const { ref } = useInView({
        rootMargin: "10px",
        onChange(inView) {
            if (inView) {
                onBottomReached();
            }
        }
    });

    return (
        <div>
            {children}
            <div ref={ref}></div>
        </div>
    )
}