import { FeedHeader } from "@/components/Feed/FeedHeader";
import { FollowingFeed } from "@/components/Feed/FollowingFeed";
import { ReturnBack } from "@/components/ui/ReturnBack";
import { Tabs } from "@/components/ui/Tabs";
import { Displayname } from "@/components/User/Displayname";
import { Username } from "@/components/User/Username";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getFollowingByUsername } from "@/lib/queries/user-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            displayUsername: true,
        }
    });

    if (!user) {
        return { title: "Profile / X Clone", description: "User not found" };
    }

    return {
        title: `People followed by ${user.displayUsername} (@${username}) / X Clone`,
        description: `List of people followed by @${username}`,
    }
}

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {

    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            displayUsername: true,
            isVerified: true
        }
    });

    const tabs = [
        {
            label: "Followers",
            href: `/${username}/followers`
        },
        {
            label: "Following",
            href: `/${username}/following`
        }
    ];

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getFollowingByUsername(username),
        queryKey: ["following", username],
        initialPageParam: undefined
    });

    return (
        <div className="min-h-screen">
            <FeedHeader styles="flex flex-col gap-2 px-0">
                <div className="w-full px-2 flex items-center gap-6 mt-1">
                    <ReturnBack />
                    <div>
                        <Displayname
                            username={username}
                            displayName={user?.displayUsername ?? ""}
                            isVerified={user?.isVerified ?? false}
                            useLink={false}
                            styles="text-xl"
                        />
                        <Username
                            username={username}
                            styles="text-sm"
                            useLink={false}
                        />
                    </div>
                </div>
                <Tabs tabs={tabs} />
            </FeedHeader>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <FollowingFeed username={username} />
            </HydrationBoundary>
        </div>
    )
}