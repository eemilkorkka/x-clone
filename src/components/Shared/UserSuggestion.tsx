"use client";
import UserCard from "./UserCard";
import Button from "./Button";
import { useEffect, useState } from "react";
import { follow } from "@/utils/utilFunctions";
import { Session } from "next-auth";
import { User } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { useFollowMutation } from "@/hooks/useFollowMutation";

interface UserSuggestionProps {
    user: User;
    username: string;
    showBio?: boolean;
    session: Session | null;
}

const fetchUserData = async (username: string): Promise<User> => {
    const response = await fetch(`/api/users/${username}`);
    const json = await response.json();
    return json.user;
}

const UserSuggestion = ({ user, username, showBio, session }: UserSuggestionProps) => {

    const {
        data,
        refetch
    } = useQuery({
        queryKey: ["follows", username],
        queryFn: () => fetchUserData(username),
    });

    const isFollowing = data?.followers.some(follower => follower.followerId === parseInt(session?.user.id!));
    const [text, setText] = useState<string>(!isFollowing ? "Follow" : "Following");

    useEffect(() => {
        setText(isFollowing ? "Following" : "Follow");
    }, [isFollowing]);

    const handleFollowClick = async () => {
        try {
            await follow(username);
            await refetch();
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
        }
    }

    const followMutation = useFollowMutation(handleFollowClick, ["follows", username], isFollowing, data?.UserID!);

    return (
        <UserCard
            image={user.ProfilePicture}
            username={username}
            displayName={user.DisplayName}
            style="flex-col"
            bio={showBio ? (user.Bio ?? undefined) : undefined}
        >
            {username !== session?.user.username && (
                <Button
                    variant={isFollowing ? "outline" : "black"}
                    hoverColor={isFollowing ? "red" : "gray"}
                    textColor="black"
                    style={`text-sm px-4 pt-2 pb-2 ${isFollowing && "hover:border-red-500! hover:text-red-500"}`}
                    onClick={(e) => { e.preventDefault(); followMutation?.mutate(); }}
                    onMouseOver={() => isFollowing && setText("Unfollow")}
                    onMouseLeave={() => isFollowing && setText("Following")}
                >
                    {text}
                </Button>
            )}
        </UserCard>
    );
}

export default UserSuggestion;