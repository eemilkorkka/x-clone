import { ProfileFeedHeader } from "@/components/Profile/ProfileFeedHeader";
import { ProfileInfo } from "@/components/Profile/ProfileInfo";
import { Tabs } from "@/components/Tabs";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getUserByUsernameOrEmail } from "@/lib/queries/user-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            displayUsername: true,
        }
    });
    
    if (!user) {
        return { title: "Profile", description: "User not found" };
    }

    return {
        title: `${user.displayUsername} (@${username})`,
        description: `Profile page of @${username}`,
    }
}

export default async function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ username: string }>
}>) {

    const { username } = await params;
    const session = await getSession();
    const queryClient = getQueryClient();

    const generalTabs = [
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
        },
    ];

    const ownTabs = [...generalTabs, {
        label: "Likes",
        href: `/${username}/likes`
    }];

    const [user, postsCount, likesCount, mediaCount] = await Promise.all([
        prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                displayUsername: true,
                id: true,
            }
        }),
        prisma.tweet.count({
            where: {
                user: {
                    username: username
                }
            }
        }),
        prisma.like.count({
            where: {
                user: {
                    username: username
                }
            }
        }),
        prisma.file.count({
            where: {
                tweet: {
                    user: {
                        username: username
                    }
                }
            }
        })
    ]);

    await queryClient.prefetchQuery({
        queryFn: () => getUserByUsernameOrEmail(username),
        queryKey: ["user", username]
    });

    return (
        <div>
            <ProfileFeedHeader
                username={username}
                displayName={user?.displayUsername ?? ""}
                postsCount={postsCount}
                likesCount={likesCount}
                mediaCount={mediaCount}
            />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProfileInfo username={username} />
            </HydrationBoundary>
            <Tabs tabs={username === session?.user.username ? ownTabs : generalTabs} styles="border-b border-gray-200" />
            {children}
        </div>
    )
}