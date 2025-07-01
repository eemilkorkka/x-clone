import { ReactNode } from "react";

interface MediaGridProps {
    children: ReactNode;
}

const MediaGrid = ({ children }: MediaGridProps) => {
    return (
        <div className="grid grid-cols-3 gap-1 border-t-1 border-gray-200 p-1">
            {children}
        </div>
    );
}

export default MediaGrid;