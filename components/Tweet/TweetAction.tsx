import { cn } from "@/lib/utils";
import {  UseMutationResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type MutationResponse =
    | { error: string; message?: undefined }
    | { message: string; error?: undefined };

interface TweetActionProps {
    tweetId: number;
    statCount?: number;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    isActive?: boolean;
    styles?: string;
    hoverTextColor?: string;
    hoverBgColor?: string;
    activeColor?: string;
    mutation?: UseMutationResult<MutationResponse, Error, FormData>;
    onClick?: () => void;
}

export const TweetAction = ({
    tweetId,
    statCount,
    icon,
    activeIcon,
    isActive,
    styles,
    hoverTextColor = "group-hover:text-sky-500",
    hoverBgColor = "group-hover:bg-sky-500/20",
    activeColor = "text-sky-500",
    mutation,
    onClick

}: TweetActionProps) => {

    return (
        <form className="flex items-center group hover:cursor-pointer w-fit h-fit" onClick={(e) => e.stopPropagation()}>
            <input type="hidden" name="postId" defaultValue={tweetId} />
            <button
                type="submit"
                className={cn("flex items-center gap-1 text-zinc-500 hover:cursor-pointer", hoverTextColor, styles)}
                onClick={onClick}
                formAction={async formData => {
                    mutation?.mutate(formData);
                }}
            >
                <span className={cn(hoverBgColor, "p-2 rounded-full", isActive && activeColor)}>
                    {isActive && activeIcon ? activeIcon : icon}
                </span>
                {statCount !== undefined && statCount > 0 && <span className={cn("text-sm", isActive && activeColor)}>{statCount}</span>}
            </button>
        </form>
    )
}