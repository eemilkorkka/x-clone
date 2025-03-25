import { ReactNode } from "react";

interface IconProps {
    children: ReactNode
    onClick?: () => void;
}
const Icon = ({ children, onClick }: IconProps) => {
    return (
        <div className="hover:bg-xblue/20 hover:cursor-pointer p-2 rounded-full text-xblue">
            {children}
        </div>
    );
}

export default Icon;