"use client";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query"
import UserSuggestion from "../Shared/UserSuggestion"
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useScrollListener } from "@/hooks/useScrollListener";
import { usePathname } from "next/navigation"
import { User } from "@/types/User";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingBlock from "../Shared/LoadingBlock";

const FollowList = ({ type }: { type: "followers" | "following" }) => {
    const pathname = usePathname();
    const session = useSession();
    const username = pathname.split("/")[1];

    const fetchFollowers = async ({ pageParam }: { pageParam: number }) => {
        const url = type === "followers" ? `/api/${username}/followers?page=${pageParam}&limit=${50}` : `/api/${username}/following?page=${pageParam}&limit=${50}`
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch followers");
        }

        return response.json();
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ["followers"],
        queryFn: fetchFollowers,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.length + 1;
        },
    });

    const handleScroll = useInfiniteScroll(isFetching, hasNextPage, fetchNextPage);
    useScrollListener("main-scroll-container", handleScroll);

    const followers = data?.pages.flatMap(page => page) || [];

    return (
        <div className="flex flex-col">
            {followers.map((follower: User) => {
                return (
                    <div key={follower.UserID} className="hover:bg-gray-100 hover:cursor-pointer w-full p-4">
                        <Link href={`/${follower.Username}`}>
                            <UserSuggestion
                                user={follower}
                                username={follower.Username}
                                showBio={false}
                                session={session.data}
                            />
                        </Link>
                    </div>
                )
            })}
            <LoadingBlock
                isFetchingNextPage={isFetchingNextPage}
                status={status}
            />
        </div>
    )
}

export default FollowList;