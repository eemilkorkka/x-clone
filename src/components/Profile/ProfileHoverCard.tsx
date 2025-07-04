"use client";
import { ReactNode, useEffect, useState } from "react"
import { HoverCard } from "radix-ui";
import Button from "../Shared/Button";
import ProfilePicture from "../Profile/ProfilePicture";
import { useSession } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import { follow } from "@/utils/utilFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/userType";
import { useFollowMutation } from "@/hooks/useFollowMutation";

interface ProfileHoverCardProps {
    children: ReactNode;
    username: string;
}

const fetchUserData = async (username: string): Promise<User> => {
    const response = await fetch(`/api/users/${username}`);
    const json = await response.json();
    return json.user;
};

const ProfileHoverCard = ({ children, username }: ProfileHoverCardProps) => {
    const session = useSession();
    const queryClient = useQueryClient();

    const {
        data
    } = useQuery({
        queryKey: ["follows", username],
        queryFn: () => fetchUserData(username)
    });

    const isFollowing = data?.followers.some((follower: { followerId: number }) => follower.followerId === parseInt(session.data?.user.id!));
    const [open, setOpen] = useState<boolean>(false);
    const [text, setText] = useState(isFollowing ? "Following" : "Follow");

    useEffect(() => {
        setText(isFollowing ? "Following" : "Follow");
    }, [isFollowing]);

    const handleFollowClick = async () => {
        try {
            await follow(username);
            queryClient.invalidateQueries({ queryKey: ["follows"] });
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
        }
    };

    const followMutation = useFollowMutation(handleFollowClick, ["follows", username], isFollowing, data?.UserID!);

    console.log(data?.followers);

    return (
        <HoverCard.Root open={open} onOpenChange={setOpen}>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>
            <HoverCard.Portal>
                {data && (
                    <HoverCard.Content className="flex flex-col gap-4 bg-white shadow-md w-72 justify-between p-4 rounded-xl z-20">
                        <div className={`flex ${isFollowing ? "gap-25" : "gap-30"}`}>
                            <ProfilePicture
                                style="rounded-full w-15 h-15 shrink-0"
                                image={data.ProfilePicture}
                                href={username}
                            />
                            {session.data?.user?.username !== username && (
                                <div>
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
                                </div>
                            )}
                        </div>
                        <ProfileInfo
                            displayName={data.DisplayName}
                            username={username}
                            bio={data.Bio ?? "Lorem ipsum dolor sit amet"}
                            followers={data.followers}
                            following={data.following}
                            isProfileHoverCard={true}
                        />
                    </HoverCard.Content>
                )}
            </HoverCard.Portal>
        </HoverCard.Root>
    );
};

export default ProfileHoverCard;