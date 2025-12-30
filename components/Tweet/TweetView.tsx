"use client";

import { useQuery } from "@tanstack/react-query";
import { Tweet } from "./Tweet";
import { TweetActions } from "./TweetActions";
import { TweetForm } from "./TweetForm";

const fetchTweetById = async (id: number) => {
    const response = await fetch(`/api/posts/${id}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweet");
    }
}

export const TweetView = ({ id }: { id: number }) => {

    const { data, isLoading } = useQuery({
        queryFn: () => fetchTweetById(id),
        queryKey: ["tweet", id],
        refetchOnWindowFocus: false
    });

    return (
        <div>
            {isLoading && !data ? (
                <p>loading...</p>
            ) : (
                <>
                    <Tweet type="status" tweet={data} useLink={false} isParentTweet={false} />
                    <TweetActions type="status" tweet={data} styles="ml-0 border-y-1 border-gray-200 p-2 mx-4" />
                    <TweetForm type="reply" parentTweetId={data.id} isComposeModal={false} />
                </>
            )}
        </div>
    )
}