import { MutateFunction, UseMutationResult } from "@tanstack/react-query";
import { useActionState } from "react";
import { twMerge } from "tailwind-merge";

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
    mutation

}: TweetActionProps) => {

    return (
        <form className="flex items-center group hover:cursor-pointer w-fit h-fit" onClick={(e) => e.stopPropagation()}>
            <input type="hidden" name="postId" defaultValue={tweetId} />
            <button
                type="submit"
                className={twMerge(`flex items-center gap-1 text-zinc-500 ${hoverTextColor} hover:cursor-pointer`, styles)}
                formAction={async formData => {
                    mutation?.mutate(formData);
                }}
            >
                <span className={`${hoverBgColor} ${isActive ? activeColor : ""} p-2 rounded-full`}>
                    {isActive && activeIcon ? activeIcon : icon}
                </span>
                {statCount !== undefined && statCount > 0 && <span className={`text-sm ${isActive && activeColor}`}>{statCount}</span>}
            </button>
        </form>
    )
}