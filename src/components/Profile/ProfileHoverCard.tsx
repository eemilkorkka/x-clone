"use client";
import { ReactNode, useEffect, useState } from "react"
import { HoverCard } from "radix-ui";
import Button from "../Shared/Button";
import ProfilePicture from "../Profile/ProfilePicture";
import { useSession } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import { follow } from "@/utils/utilFunctions";

interface ProfileHoverCardProps {
    children: ReactNode;
    username: string;
}

const ProfileHoverCard = ({ children, username }: ProfileHoverCardProps) => {

    const session = useSession();
    const [data, setData] = useState<any>();
    const [following, setIsFollowing] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const isFollowing: boolean = data?.user.followers.some((follower: { followerId: number }) => follower.followerId === parseInt(session.data?.user.id!));

    useEffect(() => {
        const fetchData = async (open: boolean) => {
            if (!open || username === "") {
                setData(undefined);
                return;
            }

            const response = await fetch(`/api/users/${username}`);
            const json = await response.json();
            setData(json);
        }

        fetchData(open);
    }, [open, following]);

    useEffect(() => {
        setIsFollowing(isFollowing);
    }, [isFollowing]);

    useEffect(() => {
        setText(following ? "Following" : "Follow");
    }, [following]);


    const handleFollowClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFollowing(prev => !prev);
        follow(username);
    }

    return (
        <HoverCard.Root onOpenChange={(open) => setOpen(open)}>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>
            <HoverCard.Portal>
                {data && (
                    <HoverCard.Content className="flex flex-col gap-4 bg-white shadow-md w-72 justify-between p-4 rounded-xl z-20">
                        <div className={`flex ${following ? "gap-25" : "gap-30"}`}>
                            <ProfilePicture
                                style="rounded-full w-15 h-15 shrink-0"
                                image={data.user.ProfilePicture}
                                href={username}
                            />
                            {session.data?.user?.username !== username && (
                                <div>
                                    <Button
                                        variant={following ? "outline" : "black"}
                                        hoverColor={following ? "red" : "gray"}
                                        textColor="black"
                                        style={`text-sm px-4 pt-2 pb-2 ${following && "hover:border-red-500! hover:text-red-500"}`}
                                        onClick={(e) => handleFollowClick(e)}
                                        onMouseOver={() => following && setText("Unfollow")}
                                        onMouseLeave={() => following && setText("Following")}
                                    >
                                        {text}
                                    </Button>
                                </div>
                            )}
                        </div>
                        <ProfileInfo
                            displayName={data.user.DisplayName}
                            username={username}
                            bio={data.user.Bio ?? "Lorem ipsum dolor sit amet"}
                            followers={data.user.followers}
                            following={data.user.following}
                        />
                    </HoverCard.Content>
                )}
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}

export default ProfileHoverCard;