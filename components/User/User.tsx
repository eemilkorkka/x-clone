import { UserBase } from "@/types/User";
import { CustomAvatar } from "./CustomAvatar";
import { Username } from "./Username";
import { Displayname } from "./Displayname";
import React from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface UserProps {
    useLink?: boolean;
    user?: UserBase | null;
    children: React.ReactNode;
    styles?: string;
    contentStyles?: string;
}

export const User = ({ useLink = true, user, children, styles, contentStyles }: UserProps) => {

    if (!user || !user?.username) return null;

    const userElement = (
        <>
            <CustomAvatar 
                src={user.image ?? ""} 
                size="md" 
                alt={`@${user.username}`} 
                styles="mr-4" 
                useLink={useLink} 
            />
            <div className="flex-1 flex justify-between">
                <div className={twMerge("flex flex-col -space-y-1", contentStyles)}>
                    <Displayname username={user.username ?? ""} displayName={user.displayUsername ?? ""} useLink={useLink} />
                    <Username username={user.username ?? ""} useLink={useLink} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    {children}
                </div>
            </div>
        </>
    );

    const className = twMerge("flex items-center hover:bg-ring/20 w-full p-2 hover:cursor-pointer", styles);

    return useLink ? (
        <Link href={`/${user.username}`} className={className}>
            {userElement}
        </Link>
    ) : (
        <div className={className}>
            {userElement}
        </div>
    )
}