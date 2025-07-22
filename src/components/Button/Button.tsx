import { ReactNode } from "react";

const hoverColors = {
    blue: "hover:bg-blue-400/10",
    gray: "hover:bg-gray-700/10",
    white: "hover:bg-white/10",
    red: "hover:bg-red-500/10"
};  

interface ButtonProps {
    type?: "submit" | "reset" | "button";
    variant?: "blue" | "white" | "black" | "red" | "outline";
    textColor?: string;
    hoverColor?: keyof typeof hoverColors;
    styles?: string;
    disabled?: boolean;
    children: ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    onMouseOver?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
}

const Button = (
    { 
        type, 
        variant, 
        textColor, 
        hoverColor, 
        styles, 
        disabled, 
        children, 
        onClick, 
        onMouseOver,
        onMouseLeave, 
    }: ButtonProps) => { 

    const variants = {
        blue: "bg-xblue text-white",
        white: "bg-white text-gray-900",
        black: "bg-black text-white",
        red: "bg-red-500 text-white",
        outline: `bg-transparent ${textColor ?? "text-xblue"} border border-gray-300 ${hoverColors[hoverColor ?? "blue"]}`,
    }; 

    return (
        <button 
            disabled={disabled}
            type={type ?? "button"} 
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            className={`${styles} rounded-full text-center font-bold text-lg p-2.5 ${!disabled && "hover:cursor-pointer"} outline-none ${variant ? variants[variant] : variants.blue}`}>
                {children}
        </button>
    );
}

export default Button;
