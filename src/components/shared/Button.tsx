import { ReactNode } from "react";

const hoverColors = {
    blue: "hover:bg-blue-400/10",
    white: "hover:bg-white/10",
};  

interface ButtonProps {
    type?: "submit" | "reset" | "button";
    variant?: "blue" | "white" | "black" | "outline";
    textColor?: string;
    hoverColor?: keyof typeof hoverColors;
    style?: string;
    children: ReactNode;
}

const Button = ({ type, variant, textColor, hoverColor, style, children }: ButtonProps) => { 

    const variants = {
        blue: "bg-xblue text-white",
        white: "bg-white text-gray-900",
        black: "bg-black text-white",
        outline: `bg-transparent ${textColor ?? "text-xblue"} border border-gray-500 ${hoverColors[hoverColor ?? "blue"]}`,
    }; 

    return (
        <button 
            type={type ?? "button"} 
            className={`${style} rounded-full font-bold text-lg p-2.5 hover:cursor-pointer ${variant ? variants[variant] : variants.blue}`}>
                {children}
        </button>
    );
}

export default Button;
