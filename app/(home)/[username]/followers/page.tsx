import { FeedHeader } from "@/components/Feed/FeedHeader";
import { FollowersFeed } from "@/components/Feed/FollowersFeed";
import { ReturnBack } from "@/components/ReturnBack";
import { Tabs } from "@/components/Tabs";
import { Displayname } from "@/components/User/Displayname";
import { Username } from "@/components/User/Username";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getFollowersByUsername } from "@/lib/queries/user-queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function FollowersPage({ params }: { params: Promise<{ username: string }> }) {

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
        queryFn: () => getFollowersByUsername(username),
        queryKey: ["followers", username],
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
                <FollowersFeed username={username} />
            </HydrationBoundary>
        </div>
    )
}