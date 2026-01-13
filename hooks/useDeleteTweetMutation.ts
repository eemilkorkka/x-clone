import { deleteTweet } from "@/app/actions/deleteTweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { toastMessage } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useGetProfileFeedQueryKey } from "./useGetProfileFeedQueryKey";

export const useDeleteTweetMutation = (tweetId: number) => {
    const queryClient = getQueryClient();
    const { data } = authClient.useSession();
    const searchParams = useSearchParams();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();

    const deleteTweetMutation = useMutation({
        mutationFn: deleteTweet,
        onSuccess: (ctx) => {
            queryClient.invalidateQueries({ queryKey: ["tweets", data?.user.id, searchParams.get("feed") ?? "foryou"] });
            queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
            queryClient.invalidateQueries({ queryKey: ["replies", tweetId] });
            queryClient.invalidateQueries({ queryKey: profileFeedQueryKey });
            toastMessage(ctx.message ?? "Post deleted successfully.", true);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "Failed to delete post.", false);
        }
    });

    return { deleteTweetMutation };
}