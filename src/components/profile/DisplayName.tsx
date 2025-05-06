import ProfileHoverCard from "@/components/Profile/ProfileHoverCard";

interface DisplayNameProps {
    displayName: string;
    variant?: keyof typeof displayNameVariants;
}

export const displayNameVariants = {
    default: "text-lg",
    small: "text-[15px]"
}

const DisplayName = ({ displayName, variant }: DisplayNameProps) => {
    return (
        <span className={`font-bold whitespace-nowrap hover:underline ${displayNameVariants[variant ?? "default"]}`}>{displayName}</span>  
    );
}

export default DisplayName;