"use client";

import { Dispatch, SetStateAction, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DisplayContext } from "@/Context/DisplayContext";
import { bgColors } from "@/utils/colors";

interface TabsSwitcherProps {
    tabs: string[];
    currentTab?: number;
    setCurrentTab?: Dispatch<SetStateAction<number>>;
    useLink?: boolean;
    username?: string;
    style?: string;
}

const buttonStyles = "w-full flex justify-center h-13 font-bold hover:bg-gray-200 hover:cursor-pointer";
const spanStyles = "relative flex flex-col w-fit justify-center h-full";

const TabSwitcher = ({
    tabs,
    currentTab,
    setCurrentTab,
    useLink = false,
    username,
    style = ""
}: TabsSwitcherProps) => {
    const pathname = usePathname();
    const { selectedIndex } = useContext(DisplayContext)!;

    const getLinkPath = (tab: string) => {
        const lower = tab.toLowerCase();
        return lower === "posts" ? `/${username}` : `/${username}/${lower}`;
    }

    const getIsActive = (index: number, tab: string) => {
        if (useLink) {
            return pathname === getLinkPath(tab);
        }
        return currentTab === index;
    }

    const renderTab = (tab: string, index: number) => {
        const isActive = getIsActive(index, tab);
        const underlineColor = bgColors[selectedIndex ?? 0].color;
        const underline = isActive ? (
            <div className={`w-full h-1 absolute bottom-0 ${underlineColor} rounded-full`} />
        ) : null;

        const content = (
            <span className={spanStyles}>
                {tab}
                {underline}
            </span>
        );

        const textColor = isActive ? "text-black" : "text-gray-500";

        if (useLink) {
            return (
                <Link
                    key={index}
                    href={getLinkPath(tab)}
                    className={`${buttonStyles} ${textColor}`}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                key={index}
                onClick={() => setCurrentTab?.(index)}
                className={`${buttonStyles} ${textColor}`}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={`sticky top-0 z-10 bg-white flex flex-col w-full border-b border-gray-200 ${style}`}>
            <div className="flex">
                {tabs.map((tab, index) => renderTab(tab, index))}
            </div>
        </div>
    );
};

export default TabSwitcher;
