"use client";

import { IoSearch } from "react-icons/io5";
import { Input } from "./ui/input";
import { MdCancel } from "react-icons/md";
import { useState } from "react";

export const Searchbar = () => {

    const [searchText, setSearchText] = useState("");

    return (
        <div className="sticky top-0 py-1 bg-white">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search"
                    className="rounded-full focus-visible:border-2 focus-visible:border-sky-500 focus-visible:ring-0 p-5.5 px-8.5"
                    value={searchText}
                    onChange={(e) => setSearchText(e.currentTarget.value)}
                />
                <IoSearch className="absolute top-1/2 -translate-y-1/2 left-2.5 text-gray-500" size={20} />
                {searchText && (
                    <MdCancel className="absolute top-1/2 -translate-y-1/2 right-2.5 hover:cursor-pointer" size={20} onClick={() => setSearchText("")} />
                )}
            </div>
        </div>
    )
}