import { follow } from "@/app/actions/follow";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { UserProfile } from "@/types/User";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useFollowMutation = (username: string, isFollowing: boolean) => {
    const queryClient = getQueryClient();
    const session = authClient.useSession();
    const router = useRouter();

    const followMutation = useMutation({
        mutationFn: follow,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["user", username] });

            const previousData = queryClient.getQueryData<UserProfile>(["user", username]);

            if (!previousData || !session.data?.user.id) return { previousData };

            const newFollowers = isFollowing ?
                previousData.followers.filter(follower => follower.followerId !== session.data!.user.id)
                :
                [
                    ...previousData.followers,
                    {
                        id: Date.now(),
                        followerId: session.data.user.id,
                        followingId: previousData.id,
                        createdAt: new Date(),
                    }
                ];

            queryClient.setQueryData<UserProfile>(["user", username], {
                ...previousData,
                followers: newFollowers,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", username] });
            queryClient.invalidateQueries({ queryKey: ["user", session.data?.user.username] });
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { followMutation };
}