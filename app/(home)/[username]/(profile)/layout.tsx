import { ProfileFeedHeader } from "@/components/Profile/ProfileFeedHeader";
import { ProfileInfo } from "@/components/Profile/ProfileInfo";
import { Tabs } from "@/components/Tabs";
import { prisma } from "@/lib/prisma";
import React from "react"

export default async function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ username: string }>
}>) {

    const { username } = await params;

    const tabs = [
        {
            label: "Posts",
            href: `/${username}`
        },
        {
            label: "Replies",
            href: `/${username}/replies`
        },
        {
            label: "Media",
            href: `/${username}/media`
        }
    ];

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            displayUsername: true
        }
    });

    const postsCount = await prisma.tweet.count({
        where: {
            user: {
                username: username
            }
        }
    });

    return (
        <div>
            <ProfileFeedHeader
                username={username}
                displayName={user?.displayUsername ?? ""}
                userFound={!!user}
                postsCount={postsCount}
            />
            <ProfileInfo />
            {children}
        </div>
    )
}