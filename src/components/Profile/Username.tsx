import ProfileHoverCard from "./ProfileHoverCard";

interface UsernameProps {
    username: string;
    showProfileHoverCard?: boolean;
}

const Username = ({ username, showProfileHoverCard }: UsernameProps) => {
    const usernameElement = (
        <span className="text-gray-500 text-[15px]">@{username}</span>
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