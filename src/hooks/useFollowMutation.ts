import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query";
import { MutationFunction } from "@tanstack/react-query";
import { User } from "@/types/User";
import { useSession } from "next-auth/react";

export const useFollowMutation = 
(
    mutationFn: MutationFunction<unknown, void> | undefined, 
    queryKey: [string, string], 
    currentFollowState: boolean | undefined, 
    followingId: number | undefined
) => {
    const queryClient = useQueryClient();
    const { data } = useSession();

    const userId = parseInt(data?.user.id ?? "");

    return useMutation({
        mutationFn: mutationFn,
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ["follows"] });

            const previousData = queryClient.getQueryData(["follows"]);

            queryClient.setQueryData(queryKey, (old: User) => {

                const newFollowers = currentFollowState ? 
                old.followers.filter(f => f.followerId !== userId) : 
                [...(old.followers), { followerId: userId, followingId: followingId }];

                return {
                    ...old,
                    newData,
                    followers: newFollowers
                };
            });

            return { previousData }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["follows"] });
        },
        onError: (err, newData, context) => {
            queryClient.setQueryData(queryKey, context?.previousData)
        }
    });
}