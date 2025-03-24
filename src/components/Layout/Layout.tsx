import { ReactNode } from "react";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import SearchBar from "../shared/SearchBar";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex max-w-fit mx-auto">
            <div className="flex w-18 xl:w-65">
                <LeftSideBar />
            </div>
            <div className="flex gap-8">
                <div className="w-[598px] h-screen border-r border-l border-gray-200">
                    {children}
                </div>
                <div className="hidden lg:inline w-[350px]">
                    <SearchBar />
                </div>
            </div>
        </div>
    );
}

export default Layout;