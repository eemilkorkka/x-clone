"use client";
import UserCard from "./UserCard";
import Button from "./Button";
import { useEffect, useState } from "react";
import { follow } from "@/utils/utilFunctions";
import { useEventListener } from "@/hooks/useEventListener";
import { Session } from "next-auth";
import { User } from "@/types/userType";

interface UserSuggestionProps {
    user: User;
    username: string;
    showBio?: boolean;
    session: Session | null;
}

const UserSuggestion = ({ user, username, showBio, session }: UserSuggestionProps) => {

    const [following, setFollowing] = useState<boolean>();
    const [userData, setUserData] = useState<User>(user);
    const [text, setText] = useState<string>("");

    useEventListener("follow-event", () => {
        const fetchUserData = async () => {
            const response = await fetch(`/api/users/${username}`);
            const json = await response.json();
            setUserData(json.user);
        }

        fetchUserData();
    });

    useEffect(() => {
        setFollowing(userData?.followers.some(follower => follower.followerId === parseInt(session?.user.id!)) || false);
    }, [userData]);

    useEffect(() => {
        setText(following ? "Following" : "Follow");
    }, [following]);

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
                    variant={following ? "outline" : "black"}
                    hoverColor={following ? "red" : "gray"}
                    textColor="black"
                    style={`text-sm px-4 pt-2 pb-2 ${following && "hover:border-red-500! hover:text-red-500"}`}
                    onClick={(e) => {
                        setFollowing(prev => !prev);
                        follow(username);
                        e.preventDefault();
                    }}
                    onMouseOver={() => following && setText("Unfollow")}
                    onMouseLeave={() => following && setText("Following")}
                >
                    {text}
                </Button>
            )}
        </UserCard>
    );
}

export default UserSuggestion;