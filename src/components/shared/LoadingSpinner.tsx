import { FaSpinner } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingSpinnerProps {
    variant?: keyof typeof variants;
}

const variants = {
    default: <FaSpinner className="animate-spin" />,
    blue: <AiOutlineLoading3Quarters className="animate-spin text-xblue" size={30} />
}

export const LoadingSpinner = ({ variant }: LoadingSpinnerProps) => {
    return (
        variants[variant as keyof typeof variants] || variants.default
    );
}