import { getQueryClient } from "@/lib/getQueryClient";
import { Tweet } from "@/types/Tweet";
import { useMutation } from "@tanstack/react-query";
import { useGetProfileFeedQueryKey } from "../useGetProfileFeedQueryKey";
import { pinTweet } from "@/app/actions/pinTweet";
import { useToastMessage } from "../useToastMessage";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

export const usePinTweetMutation = (tweet: Tweet) => {
    const { data } = authClient.useSession();
    const queryClient = getQueryClient();
    const searchParams = useSearchParams();
    const profileFeedQueryKey = useGetProfileFeedQueryKey();
    const { toastMessage } = useToastMessage();

    const pinTweetMutation = useMutation({
        mutationFn: pinTweet,
        onSuccess: (ctx) => {
            queryClient.invalidateQueries({ queryKey: profileFeedQueryKey });
            queryClient.invalidateQueries({ queryKey: ["pinnedTweet", data?.user?.username] });
            queryClient.invalidateQueries({ queryKey: ["tweets", data?.user.id, searchParams.get("feed") ?? "foryou"] });
            queryClient.invalidateQueries({ queryKey: ["replies", tweet.id] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks", data?.user.username] });
            queryClient.invalidateQueries({ queryKey: ["tweet", tweet.id] });
            toastMessage(ctx.message ?? "Success", true);
        },
        onError: (ctx) => {
            toastMessage(ctx.message ?? "Failed to pin post to profile.", false);
        }
    });

    return { pinTweetMutation };
}