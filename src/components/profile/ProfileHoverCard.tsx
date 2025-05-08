"use client";
import { ReactNode, useState } from "react"
import { HoverCard } from "radix-ui";
import Button from "../shared/Button";
import ProfilePicture from "../Profile/ProfilePicture";
import { useSession } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";

interface ProfileHoverCardProps {
    children: ReactNode;
    username: string;
}

const ProfileHoverCard = ({ children, username }: ProfileHoverCardProps) => {

    const session = useSession();
    const [data, setData] = useState<any>();

    const fetchData = async (open: boolean) => {
        if (!open || username === "") {
            setData(undefined);
            return;
        }
        
        const response = await fetch(`http://localhost:3000/api/users/${username}`);
        const json = await response.json();
        setData(json);
    }

    return (
        <HoverCard.Root onOpenChange={(open) => fetchData(open)}>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>
            <HoverCard.Portal>
                {data && (
                    <HoverCard.Content className="flex flex-col gap-4 bg-white shadow-md w-72 justify-between p-4 rounded-xl">
                        <div className="flex gap-30">
                            <ProfilePicture
                                style="rounded-full w-15 h-15"
                                image={data?.user.ProfilePicture}
                                href={username}
                            />
                            {session.data?.user?.username !== username && (
                                <div>
                                    <Button variant="black" style="text-sm px-4 pt-2 pb-2">Follow</Button>
                                </div>
                            )}
                        </div>
                        <ProfileInfo 
                            displayName={data?.user.DisplayName}
                            username={username}
                            bio={data?.user.Bio ?? "Lorem ipsum dolor sit amet"}
                            followers={0}
                            following={0}
                        />
                    </HoverCard.Content>
                )}
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}

export default ProfileHoverCard;