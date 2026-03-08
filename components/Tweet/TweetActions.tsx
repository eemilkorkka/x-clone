import { FaRegComment, FaRegHeart, FaRegBookmark, FaHeart, FaBookmark } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { TweetAction } from "./TweetAction";
import { Tweet } from "@/types/Tweet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useComposeModal } from "../../context/ComposeModalContext";
import { useRouter } from "next/navigation";
import { useLikeMutation } from "@/hooks/Tweet/useLikeMutation";
import { useBookmarkMutation } from "@/hooks/Tweet/useBookmarkMutation";
import { useRetweetMutation } from "@/hooks/Tweet/useRetweetMutation";
import { AiOutlineLink } from "react-icons/ai";
import { OptionsPopover } from "./TweetPopover/OptionsPopover";
import { Icon } from "../Icon";
import { useToastMessage } from "@/hooks/useToastMessage";

interface TweetActionsProps {
    type: "status" | "tweet";
    tweet: Tweet;
    styles?: string;
}

export const TweetActions = ({ type, tweet, styles }: TweetActionsProps) => {

    const { data } = authClient.useSession();
    const router = useRouter();
    const { likeMutation } = useLikeMutation(tweet);
    const { bookmarkMutation } = useBookmarkMutation(tweet);
    const { retweetMutation } = useRetweetMutation(tweet);
    const { setTweetToReplyTo } = useComposeModal();
    const { toastMessage } = useToastMessage();

    const handleReplyActionClick = () => {
        tweet.isRetweet ? setTweetToReplyTo(tweet.originalTweet) : setTweetToReplyTo(tweet);
        router.push("/compose/post");
    }

    const tweetToCheck = tweet.isRetweet ? tweet.originalTweet : tweet;

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/${tweet.user?.username}/status/${tweet.id}`);
        toastMessage("Link copied to clipboard.", true);
    }

    const popoverOption = [
        {
            label: "Copy link",
            icon: <AiOutlineLink />,
            onClick: copyLinkToClipboard
        }
    ];

    return (
        <div className={cn("flex justify-between -ml-2", styles)}>
            <TweetAction
                tweetId={tweet.id}
                statCount={tweetToCheck._count?.replies}
                icon={<FaRegComment />}
                onClick={handleReplyActionClick}
            />
            <TweetAction
                tweetId={tweet.id}
                statCount={tweetToCheck.likes.length}
                icon={<FaRegHeart />}
                activeIcon={<FaHeart className="text-rose-500" />}
                hoverBgColor="group-hover:bg-rose-500/20"
                hoverTextColor="group-hover:text-rose-500"
                activeColor="text-rose-500"
                isActive={tweetToCheck.likes.some((like) => like.userId === data?.user.id)}
                mutation={likeMutation}
            />
            <TweetAction
                tweetId={tweet.id}
                statCount={tweetToCheck.retweets.length}
                icon={<AiOutlineRetweet />}
                hoverBgColor="group-hover:bg-emerald-500/20"
                hoverTextColor="group-hover:text-emerald-500"
                activeColor="text-emerald-500"
                isActive={tweetToCheck.retweets.some((retweet) => retweet.userId === data?.user.id)}
                mutation={retweetMutation}
            />
            {type === "status" ? (
                <>
                    <TweetAction
                        tweetId={tweet.id}
                        icon={<FaRegBookmark />}
                        activeIcon={<FaBookmark />}
                        isActive={tweetToCheck.bookmarks.some((bookmark) => bookmark.userId === data?.user.id)}
                        mutation={bookmarkMutation}
                    />
                    <OptionsPopover options={popoverOption} styles="ml-0">
                        <Icon styles="text-zinc-500 hover:text-sky-500 hover:bg-sky-500/20">
                            <FiUpload />
                        </Icon>
                    </OptionsPopover>
                </>
            ) : (
                <div className="flex -space-x-1">
                    <TweetAction
                        tweetId={tweet.id}
                        icon={<FaRegBookmark />}
                        activeIcon={<FaBookmark />}
                        isActive={tweetToCheck.bookmarks.some((bookmark) => bookmark.userId === data?.user.id)}
                        mutation={bookmarkMutation}
                    />
                    <OptionsPopover options={popoverOption}>
                        <Icon styles="text-zinc-500 hover:text-sky-500 hover:bg-sky-500/20">
                            <FiUpload />
                        </Icon>
                    </OptionsPopover>
                </div>
            )}
        </div>
    )
}