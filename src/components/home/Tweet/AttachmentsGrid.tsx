import { ReactNode, Children } from "react";

interface AttachmentsGridProps {
    children: ReactNode;
}

const AttachmentsGrid = ({ children }: AttachmentsGridProps) => {
    const itemCount = Children.count(children);

    return (
        <div
            className={`mt-2 grid gap-1 w-full ${
                itemCount > 2
                    ? "grid-cols-2 grid-rows-2"
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
