import ProfileHoverCard from "./ProfileHoverCard";

interface UsernameProps {
    username: string;
    showProfileHoverCard?: boolean;
    style?: string;
}

const Username = ({ username, showProfileHoverCard, style }: UsernameProps) => {
    const usernameElement = (
        <span className={`text-gray-500 text-[15px] ${style}`}>@{username}</span>
    );

    return (
        <>
            {showProfileHoverCard ? (
                <ProfileHoverCard username={username}>
                    {usernameElement}
                </ProfileHoverCard>
            ) : (
                usernameElement
            )}
        </>
    );
}

export default Username;