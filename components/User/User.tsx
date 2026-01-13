"use client";

import { UserBase } from "@/types/User";
import { CustomAvatar } from "./CustomAvatar";
import { Username } from "./Username";
import { Displayname } from "./Displayname";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProps {
    useLink?: boolean;
    user?: UserBase | null;
    children: React.ReactNode;
    styles?: string;
    contentStyles?: string;
}

export const User = ({ useLink = true, user, children, styles, contentStyles }: UserProps) => {

    if (!user || !user?.username) return null;
    
    const router = useRouter();

    const userElement = (
        <>
            <CustomAvatar 
                src={user.image ?? ""} 
                size="md" 
                alt={`@${user.username}`} 
                username={user.username}
                styles="mr-4"
            />
            <div className="flex-1 flex items-center justify-between">
                <div className={cn("flex w-full items-start flex-col -space-y-1", contentStyles)}>
                    <Displayname username={user.username ?? ""} displayName={user.displayUsername ?? ""} useLink={useLink} />
                    <Username username={user.username ?? ""} useLink={useLink} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    {children}
                </div>
            </div>
        </>
    );

    const className = cn("flex items-center hover:bg-ring/20 w-full p-2 hover:cursor-pointer", styles);

    return (
        <div className={className} onClick={() => useLink && router.push(`/${user.username}`)}>
            {userElement}
        </div>
    )
}