import { follow } from "@/app/actions/follow";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { UserProfile, UsersPage, UserWithFollowData } from "@/types/User";
import { InfiniteData, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useFollowMutation = (username: string, isFollowing: boolean) => {
    const queryClient = getQueryClient();
    const session = authClient.useSession();
    const router = useRouter();
    const params = useParams();

    const followMutation = useMutation({
        mutationFn: follow,
        onMutate: async () => {
            const ownFollowersQueryKey = ["followers", session.data?.user.username];
            const followersQueryKey = ["followers", params.username];

            await queryClient.cancelQueries({ queryKey: ["user", username] });
            await queryClient.cancelQueries({ queryKey: followersQueryKey });
            await queryClient.cancelQueries({ queryKey: ownFollowersQueryKey });

            const previousData = queryClient.getQueryData<UserProfile>(["user", username]);
            const previousFollowersData = queryClient.getQueryData<InfiniteData<UsersPage>>(followersQueryKey);
            const ownPreviousFollowersData = queryClient.getQueryData<InfiniteData<UsersPage>>(ownFollowersQueryKey);

            if (!session.data?.user.id) {
                return {
                    previousData,
                    previousFollowersData,
                    ownPreviousFollowersData,
                    followersQueryKey,
                    ownFollowersQueryKey
                };
            }

            const toggleFollow = <T extends UserWithFollowData>(user: T): T => ({
                ...user,
                followers: isFollowing
                    ? user.followers.filter(follower => follower.followerId !== session.data!.user.id)
                    : [
                        ...user.followers,
                        {
                            id: -1,
                            followerId: session.data!.user.id,
                            followingId: user.id,
                            createdAt: new Date(),
                        },
                    ],
            });

            if (previousData) {
                queryClient.setQueryData<UserProfile>(["user", username], toggleFollow(previousData));
            }

            if (previousFollowersData) {
                queryClient.setQueryData<InfiniteData<UsersPage>>(followersQueryKey, {
                    ...previousFollowersData,
                    pages: previousFollowersData.pages.map(page => ({
                        ...page,
                        items: page.items.map(user =>
                            user.username === username ? toggleFollow(user) : user
                        )
                    }))
                });
            }

            if (ownPreviousFollowersData) {
                queryClient.setQueryData<InfiniteData<UsersPage>>(ownFollowersQueryKey, {
                    ...ownPreviousFollowersData,
                    pages: ownPreviousFollowersData.pages.map(page => ({
                        ...page,
                        items: page.items.map(user =>
                            user.username === username ? toggleFollow(user) : user
                        )
                    }))
                });
            }

            return {
                previousData,
                previousFollowersData,
                ownPreviousFollowersData,
                followersQueryKey,
                ownFollowersQueryKey
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", username] });
            queryClient.invalidateQueries({ queryKey: ["user", session.data?.user.username] });
            queryClient.invalidateQueries({ queryKey: ["followers", username] });
            queryClient.invalidateQueries({ queryKey: ["followers", session.data?.user.username] });
            queryClient.invalidateQueries({ queryKey: ["pinnedTweet", username] });

            router.refresh();
        },
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["user", username], context.previousData);
            }

            if (context?.previousFollowersData) {
                queryClient.setQueryData(context.followersQueryKey, context.previousFollowersData);
            }

            if (context?.ownPreviousFollowersData) {
                queryClient.setQueryData(context.ownFollowersQueryKey, context.ownPreviousFollowersData);
            }

            toast.error(error?.message || "Failed to update follow status");
        }
    });

    return { followMutation };
}
