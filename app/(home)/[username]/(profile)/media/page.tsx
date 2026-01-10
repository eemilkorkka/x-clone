import { ProfileFeed } from "@/components/Profile/ProfileFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { getTweetsByUserWithMedia } from "@/lib/queries/tweet-queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getSession } from "better-auth/api";
import { redirect } from "next/navigation";

export default async function MediaPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const session = await getSession();

    if (!session) {
        redirect("/");
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