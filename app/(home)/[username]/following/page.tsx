import { FeedHeader } from "@/components/Feed/FeedHeader";
import { FollowingFeed } from "@/components/Feed/FollowingFeed";
import { ReturnBack } from "@/components/ReturnBack";
import { Tabs } from "@/components/Tabs";
import { Displayname } from "@/components/User/Displayname";
import { Username } from "@/components/User/Username";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getFollowingByUsername } from "@/lib/queries/user-queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {

    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            displayUsername: true
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
            <FeedHeader styles="flex flex-col">
                <div className="w-full px-2 flex items-center gap-6 mt-1">
                    <ReturnBack />
                    <div>
                        <Displayname
                            username={username}
                            displayName={user?.displayUsername ?? ""}
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
                <Tabs tabs={tabs} styles="mt-2" />
            </FeedHeader>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <FollowingFeed username={username} />
            </HydrationBoundary>
        </div>
    )
}