import ProfileHoverCard from "@/components/Profile/ProfileHoverCard";

interface DisplayNameProps {
    displayName: string;
    showProfileHoverCard?: boolean;
    username?: string;
    variant?: keyof typeof displayNameVariants;
}

export const displayNameVariants = {
    default: "text-lg",
    small: "text-[15px]"
}

const DisplayName = ({ displayName, showProfileHoverCard, username, variant }: DisplayNameProps) => {
    
    const displayNameElement = (
        <span className={`font-bold whitespace-nowrap hover:underline ${displayNameVariants[variant ?? "default"]}`}>{displayName}</span>
    );

    return (
        <>
            {showProfileHoverCard && username ? (
                <ProfileHoverCard username={username}>
                    {displayNameElement}
                </ProfileHoverCard>
            ) : (
                displayNameElement
            )}
        </> 
    );
}

export default DisplayName;