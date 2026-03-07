import { getQueryClient } from "@/lib/getQueryClient";
import { Tweet } from "@/types/Tweet";
import { useMutation } from "@tanstack/react-query";
import { useGetProfileFeedQueryKey } from "./useGetProfileFeedQueryKey";
import { pinTweet } from "@/app/actions/pinTweet";
import { useToastMessage } from "./useToastMessage";
import { authClient } from "@/lib/auth-client";

export const usePinTweetMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();
    const { toastMessage } = useToastMessage();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();

    const pinTweetMutation = useMutation({
        mutationFn: pinTweet,
        onSuccess: (ctx) => {
            queryClient.invalidateQueries({ queryKey: profileFeedQueryKey });
            queryClient.invalidateQueries({ queryKey: ["pinnedTweet", data?.user?.username] });
            toastMessage(ctx.message ?? "Success", true);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "Failed to pin post to profile.", false);
        }
    });

    return { pinTweetMutation };
}