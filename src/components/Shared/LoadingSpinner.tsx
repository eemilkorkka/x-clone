import { FaSpinner } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useContext } from "react";
import { DisplayContext } from "@/Context/DisplayContext";
import { textColors } from "@/utils/colors";

type variant = "default" | "color"

interface LoadingSpinnerProps {
    variant?: variant;
}

export const LoadingSpinner = ({ variant }: LoadingSpinnerProps) => {

    const { selectedIndex } = useContext(DisplayContext)!;

    const variants = {
        default: <FaSpinner className="animate-spin" />,
        color: <AiOutlineLoading3Quarters className={`animate-spin ${textColors[selectedIndex ?? 0].color}`} size={30} />
    }

    return (
        variants[variant as keyof typeof variants] || variants.default
    );
}