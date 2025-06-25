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
    bio?: string;
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
            <div className="flex gap-4 mt-2">
                <span className="text-black text-sm font-bold">{following} <span className="text-gray-500 text-sm font-normal">Following</span></span>
                <span className="text-black text-sm font-bold">{followers} <span className="text-gray-500 text-sm font-normal">{followers === 1 ? "Follower" : "Followers"}</span></span>
            </div>
        </div>
    );
}

export default ProfileInfo; 