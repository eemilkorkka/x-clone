import { ProfileFeed } from "@/components/Profile/ProfileFeed";
import { getQueryClient } from "@/lib/getQueryClient";
import { getLikesByUser } from "@/lib/queries/tweet-queries";
import { getSession } from "@/lib/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function LikesPage({ params }: { params: Promise<{ username_or_email: string }> }) {
    const { username_or_email } = await params;

    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryFn: () => getLikesByUser(username_or_email),
        queryKey: ["profilefeed", "likes", username_or_email, false],
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