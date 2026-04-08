"use client";

import { useColor } from "@/context/ColorContext";
import { cn } from "@/lib/utils";

export const IntermediateLoading = ({ styles }: { styles?: string }) => {

    const { colors } = useColor();

    return (
        <div className={cn("w-full", styles)}>
            <div className="h-1 w-full overflow-hidden">
                <div className={`animate-progress-slow w-full h-full ${colors.color} origin-left-right`}></div>
            </div>
        </div>
    )
}