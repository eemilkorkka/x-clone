"use client";

import { Button } from "../ui/button"
import { useFollowMutation } from "@/hooks/useFollowMutation";
import { cn } from "@/lib/utils";
import { UnfollowDialog } from "./UnfollowDialog";
import { follow } from "@/app/actions/follow";

interface FollowButtonProps {
    username: string;
    userId: string;
    isFollowing: boolean;
    styles?: string;
}

export const FollowButton = ({ username, userId, isFollowing, styles }: FollowButtonProps) => {

    const { followMutation } = useFollowMutation(username, isFollowing);

    const buttonStyles = cn("rounded-full font-bold px-4 hover:cursor-pointer",
        styles,
        isFollowing ? "bg-inherit border border-border text-black hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive" : "bg-black"
    );

    return !isFollowing ? (
        <Button className={buttonStyles} onMouseDown={(e) => e.stopPropagation()} onClick={() => followMutation.mutate(userId)}>Follow</Button>
    ) : (
        <UnfollowDialog username={username} onConfirmClick={() => followMutation.mutate(userId)} styles={styles}>
            <Button className={cn(buttonStyles, "m-0")} onMouseDown={(e) => e.stopPropagation()}>Unfollow</Button>
        </UnfollowDialog>
    )
}