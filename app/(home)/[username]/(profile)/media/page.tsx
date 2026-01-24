import { ProfileFeed } from "@/components/Profile/ProfileFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { prisma } from "@/lib/prisma";
import { getTweetsByUserWithMedia } from "@/lib/queries/tweet-queries";
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
        title: `Media posts by ${user.displayUsername} (@${username}) / X Clone`,
        description: `Media posts by @${username}`,
    }
}

export default async function MediaPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getTweetsByUserWithMedia(username),
        queryKey: ["profilefeed", "media", username, false],
        initialPageParam: undefined
    });

    return (
        <div className="min-h-screen">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProfileFeed type="media" />
            </HydrationBoundary>
        </div>
    )
}