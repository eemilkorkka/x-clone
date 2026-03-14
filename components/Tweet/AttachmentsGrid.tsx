import { ReactNode, Children } from "react";
import { cn } from "@/lib/utils";

interface AttachmentsGridProps {
    children: ReactNode;
}

const AttachmentsGrid = ({ children }: AttachmentsGridProps) => {
    const itemCount = Children.count(children);

    if (itemCount === 0) return;

    if (itemCount === 1) {
        return (
            <div className="inline-block w-full rounded-2xl overflow-hidden mt-2 mb-2">
                {children}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid gap-0.5 w-full mt-2 mb-2 rounded-2xl overflow-hidden",
                itemCount > 2 ? "grid-cols-2 h-75 grid-rows-2" : "grid-cols-2"
            )}
        >
            {Children.map(children, (child, index) => (
                <div
                    key={index}
                    className={cn(
                        itemCount === 3 && index === 1 && "row-span-2"
                    )}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

export default AttachmentsGrid;