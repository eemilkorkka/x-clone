"use client";

import { useQuery } from "@tanstack/react-query";
import { Tweet } from "./Tweet";
import { TweetActions } from "./TweetActions";
import { TweetForm } from "./TweetForm";
import { RepliesFeed } from "./RepliesFeed";
import { notFound } from "next/navigation";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const fetchTweetById = async (id: number) => {
    const response = await fetch(`/api/posts/${id}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch tweet");
    }
}

export const TweetView = ({ id }: { id: number }) => {
    const { data, isLoading, isError } = useQuery({
        queryFn: () => fetchTweetById(id),
        queryKey: ["tweet", id],
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !data) {
        notFound();
    }

    return (
        <div>
            {data.parentTweet && <Tweet type="tweet" tweet={data.parentTweet} useLink={false} isParentTweet={true} />}
            <Tweet type="status" tweet={data} useLink={false} isParentTweet={false} />
            <TweetActions type="status" tweet={data} styles="ml-0 border-y-1 border-border p-2 mx-4" />
            <TweetForm type="reply" parentTweetId={id} parentTweetAuthor={data.user.username} isComposeModal={false} />
            <RepliesFeed parentTweetId={id} />
        </div>
    );
}