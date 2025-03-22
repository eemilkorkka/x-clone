import { ReactNode } from "react";
import LeftSideBar from "./LeftSideBar/LeftSideBar";

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
                <div className="w-[350px]">right</div>
            </div>
        </div>
    );
}

export default Layout;