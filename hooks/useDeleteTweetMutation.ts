import { deleteTweet } from "@/app/actions/deleteTweet";
import { getQueryClient } from "@/lib/getQueryClient";
import { toastMessage } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";

export const useDeleteTweetMutation = (tweetId: number) => {
    const queryClient = getQueryClient();

    const deleteTweetMutation = useMutation({
        mutationFn: deleteTweet,
        onSuccess: (ctx) => {
            queryClient.invalidateQueries({ queryKey: ["tweets"] });
            queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
            toastMessage(ctx.message ?? "asdfsad", true);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "asdfsad", false);
        }
    });

    return { deleteTweetMutation };
}