"use client";

import { startTransition } from "react";
import { Button } from "../ui/button"
import { useFollowMutation } from "@/hooks/useFollowMutation";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
    username: string;
    userId: string;
    isFollowing: boolean;
    styles?: string;
}

export const FollowButton = ({ username, userId, isFollowing, styles }: FollowButtonProps) => {

    const { followMutation } = useFollowMutation(username, isFollowing);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        startTransition(() => {
            followMutation.mutate(formData);
        });
    }

    return (
        <form onSubmit={handleSubmit} className={styles}>
            <input type="hidden" name="userId" defaultValue={userId} />
            <Button type="submit" className={cn("rounded-full font-bold px-4 hover:cursor-pointer", 
                isFollowing ? "bg-inherit border border-border text-black hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive" : "bg-black"
            )} onMouseDown={(e) => e.stopPropagation()}>{isFollowing ? "Unfollow" : "Follow"}</Button>
        </form>
    )
}