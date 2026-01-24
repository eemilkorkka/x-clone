import { ProfileFeed } from "@/components/Profile/ProfileFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getLikesByUser } from "@/lib/queries/tweet-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

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
        return { title: "Profile / X Clone", description: "User not found" };
    }

    return {
        title: `Posts liked by ${user.displayUsername} (@${username}) / X Clone`,
        description: `Liked posts by @${username}`,
    }
}

export default async function LikesPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (session && username !== session.user.username) {
        redirect(`/${username}`);
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getLikesByUser(username),
        queryKey: ["profilefeed", "likes", username, false],
        initialPageParam: undefined,
    });

    return (
        <div className="min-h-screen">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProfileFeed type="likes" />
            </HydrationBoundary>
        </div>
    )
}