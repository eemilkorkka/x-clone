import { ReactNode, Children } from "react";

interface AttachmentsGridProps {
    children: ReactNode;
}

const AttachmentsGrid = ({ children }: AttachmentsGridProps) => {
    const itemCount = Children.count(children);

    return (
        <div
            className={`mt-2 grid gap-1 w-full ${
                itemCount === 3
                    ? "grid-cols-2 grid-rows-2 h-[300px]"
                    : itemCount === 4
                    ? "grid-cols-2 grid-rows-2 h-[300px]"
                    : itemCount > 1
                    ? "grid grid-cols-2 h-[300px]"
                    : "inline"
            }`}
        >
            {children}
        </div>
    );
}

export default AttachmentsGrid;
