import DisplayName from "./DisplayName";
import Username from "./Username";
import { displayNameVariants } from "./DisplayName";

interface ProfileInfoProps {
    showDisplayName?: boolean;
    displayName?: string;
    displayNameVariant?: keyof typeof displayNameVariants;
    username: string;
    showJoinDate?: boolean;
    joinDate?: string;
    bio: string;
    followers: number;
    following: number;
}

const ProfileInfo = (
    { 
        displayName, 
        displayNameVariant, 
        username, 
        showJoinDate, 
        joinDate,
        bio, 
        followers, 
        following 
    }: ProfileInfoProps) => {
    return (
        <div className="flex flex-col">
            <DisplayName displayName={displayName!} variant={displayNameVariant} />
            <Username username={username} />
            <p className="mt-2">{bio}</p>
            {showJoinDate && (
                <span className="text-gray-500">Joined {joinDate}</span>
            )}
        </div>
    );
}

export default ProfileInfo; 