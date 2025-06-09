import { ReactNode, Children } from "react";

interface AttachmentsGridProps {
    children: ReactNode;
}

const AttachmentsGrid = ({ children }: AttachmentsGridProps) => {
    const itemCount = Children.count(children);

    if (itemCount === 0) return;

    if (itemCount === 1) {
        return (
            <div className="inline-block w-full rounded-2xl overflow-hidden">
                {children}
            </div>
        );
    }

    return (
        <div
            className={`grid gap-0.5 w-full rounded-2xl overflow-hidden h-[42vw] xs:h-[37vw] md:h-[271px] max-h-[500px] ${
                itemCount > 2
                    ? "grid-cols-2 h-75 grid-rows-2"
                    : "grid-cols-2"
            }`}
        >
            {children}
        </div>
    );
}

export default AttachmentsGrid;