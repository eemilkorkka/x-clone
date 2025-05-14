import { ReactNode } from "react";

interface IconProps {
    children: ReactNode
    onClick?: (e: React.MouseEvent) => void;
}

const Icon = ({ children, onClick }: IconProps) => {
    return (
        <div className="relative hover:bg-xblue/10 hover:cursor-pointer p-2 rounded-full text-xblue" onClick={onClick}>
            {children}
        </div>
    );
}

export default Icon;