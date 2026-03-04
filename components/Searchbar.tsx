"use client";

import { IoSearch } from "react-icons/io5";
import { Input } from "./ui/input";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { useColor } from "@/context/ColorContext";
import { useQuery } from "@tanstack/react-query";
import { UserBase } from "@/types/User";
import useDebounce from "@/hooks/useDebounce";
import { User } from "./User/User";
import { UserSkeleton } from "./User/UserSkeleton";

const searchForUsers = async (username_or_displayname: string) => {
    const response = await fetch(`/api/users?username_or_displayname=${username_or_displayname}`);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

export const Searchbar = () => {

    const [searchText, setSearchText] = useState("");
    const [searchInputFocused, setSearchInputFocused] = useState(false);
    const debouncedSearch = useDebounce(searchText, 300);
    const { colors } = useColor();

    const { data, isLoading } = useQuery({
        queryKey: ["users_search", debouncedSearch],
        queryFn: () => searchForUsers(debouncedSearch),
        enabled: !!debouncedSearch
    });

    return (
        <div className="relative sticky top-0 py-1.5 bg-background">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search"
                    className={`!bg-background rounded-full focus-visible:border-2 ${colors.focusVisibleBorderColor} focus-visible:ring-0 p-5.5 px-8.5`}
                    value={searchText}
                    onChange={(e) => setSearchText(e.currentTarget.value)}
                    onFocus={() => setSearchInputFocused(true)}
                    onBlur={() => setSearchInputFocused(false)}
                />
                <IoSearch className="absolute top-1/2 -translate-y-1/2 left-2.5 text-gray-500" size={20} />
                {searchText && searchInputFocused && (
                    <MdCancel className="absolute top-1/2 -translate-y-1/2 right-2.5 hover:cursor-pointer" size={20} onMouseDown={() => setSearchText("")} />
                )}
            </div>
            <div className={`overflow-y-auto w-full bg-background rounded-md shadow-white drop-shadow-lg z-50 p-0 ${searchInputFocused ? "block" : "hidden"}`} onMouseDown={(e) => e.preventDefault()}>
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <UserSkeleton key={index} />
                    ))
                ) : (
                    data && data.length > 0 ? (
                        data.map((user: UserBase) => (
                            <User key={user.id} user={user} />
                        ))
                    ) : (
                        debouncedSearch && <p className={`p-4 ${colors.textColor}`}>No users found.</p>
                    )
                )}
            </div>
        </div>
    )
}