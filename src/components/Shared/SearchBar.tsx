"use client";
import { useState } from "react";
import { IoSearch, IoCloseCircle } from "react-icons/io5";

const SearchBar = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [searchFocused, setSearchFocused] = useState<boolean>(false);

    return (
        <form className="relative flex items-center w-full mt-2">
            <input 
                className="w-full p-2 px-9 rounded-full border border-gray-300 outline-0 focus:border-xblue focus:border-2" 
                type="text" 
                placeholder="Search"
                value={searchText}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => setSearchText(e.target.value)} 
            />
            <IoSearch 
                className="absolute left-3" 
                fill="gray" 
                size="19" 
                onClick={() => setSearchText("")} 
            />
            { searchFocused && searchText && 
                <IoCloseCircle 
                    className="absolute right-3 hover:cursor-pointer" 
                    size="20" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSearchText("")} 
                /> 
            }
        </form>
    );
}

export default SearchBar;
