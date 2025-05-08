import { ReactNode, Children } from "react";

interface AttachmentsGridProps {
    children: ReactNode;
}

const AttachmentsGrid = ({ children }: AttachmentsGridProps) => {
    const itemCount = Children.count(children);

    return (
        <div
            className={`grid gap-1 w-full max-h-[500px] ${
                itemCount > 2
                    ? "grid-cols-2 h-[300px] grid-rows-2"
                    : itemCount > 1
                    ? "grid grid-cols-2"
                    : "inline"
            }`}
        >
            {children}
        </div>
    );
}

export default AttachmentsGrid;
