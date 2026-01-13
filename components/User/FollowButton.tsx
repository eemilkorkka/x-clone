"use client";

import { Button } from "../ui/button"

interface FollowButtonProps {
    isFollowing: boolean;
}

export const FollowButton = ({ isFollowing }: FollowButtonProps) => {
    return (
        <Button className="rounded-full font-bold px-4 hover:cursor-pointer">{isFollowing ? "Unfollow" : "Follow"}</Button>
    )
}