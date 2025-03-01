import { ReactNode } from "react";

const variants = {
    blue: "bg-xblue text-white",
    white: "bg-white text-gray-900",
    outline: "bg-transparent text-xblue border-1 border-gray-500",
};

interface ButtonProps {
    variant?: keyof typeof variants;
    children: ReactNode
}

const Button = ({ variant, children }: ButtonProps) => {
    return (
        <button className={`w-72 rounded-full font-bold p-2.5 ${variant ? variants[variant] : variants.blue }`}>{children}</button>
    )
}

export default Button;