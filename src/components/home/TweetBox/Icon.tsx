import { ReactNode } from "react";

interface IconProps {
    children: ReactNode
    onClick?: () => void;
}

const Icon = ({ children, onClick }: IconProps) => {
    return (
        <div className="relative hover:bg-xblue/20 hover:cursor-pointer p-2 rounded-full text-xblue" onClick={onClick}>
            {children}
        </div>
    );
}

export default Icon;