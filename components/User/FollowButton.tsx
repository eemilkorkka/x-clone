"use client";

import { Button } from "../ui/button"
import { useFollowMutation } from "@/hooks/useFollowMutation";
import { cn } from "@/lib/utils";
import { UnfollowDialog } from "./UnfollowDialog";

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
        isFollowing ? "bg-inherit border border-border text-foreground hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive" : "bg-foreground"
    );

    return !isFollowing ? (
        <Button className={buttonStyles} onClick={(e) => { e.stopPropagation(); followMutation.mutate(userId); }}>Follow</Button>
    ) : (
        <UnfollowDialog username={username} onConfirmClick={() => followMutation.mutate(userId)} styles={styles}>
            <Button className={cn(buttonStyles, "m-0")}>Unfollow</Button>
        </UnfollowDialog>
    )
}