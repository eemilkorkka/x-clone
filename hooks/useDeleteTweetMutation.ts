import { deleteTweet } from "@/app/actions/deleteTweet";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { toastMessage } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useDeleteTweetMutation = (tweetId: number) => {
    const queryClient = getQueryClient();
    const { data } = authClient.useSession();
    const searchParams = useSearchParams();

    const deleteTweetMutation = useMutation({
        mutationFn: deleteTweet,
        onSuccess: (ctx) => {
            queryClient.invalidateQueries({ queryKey: ["tweets", data?.user.id, searchParams.get("feed") ?? "foryou"] });
            queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
            toastMessage(ctx.message ?? "asdfsad", true);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "asdfsad", false);
        }
    });

    return { deleteTweetMutation };
}