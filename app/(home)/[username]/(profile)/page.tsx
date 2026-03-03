import { ProfileFeed } from "@/components/Profile/ProfileFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { getTweetsByUser } from "@/lib/queries/tweet-queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getTweetsByUser(username, false),
        queryKey: ["profilefeed", "posts", username, false],
        initialPageParam: undefined,
    });
    
    return (
        <div className="min-h-screen">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProfileFeed type="posts" />
            </HydrationBoundary>
        </div>
    )
}