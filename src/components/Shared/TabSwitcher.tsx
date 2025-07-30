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

const TabSwitcher = ({ tabs, currentTab, setCurrentTab, useLink, username, style }: TabsSwitcherProps) => {
    const pathname = usePathname();
    const { selectedIndex } = useContext(DisplayContext)!;

    const underlineStyles = `w-full h-1 absolute bottom-0 ${bgColors[selectedIndex ?? 0].color} rounded-full`;

    const isTabActive = (tab: string) => {
        if (tab.toLowerCase() === 'posts') {
            return pathname === `/${username}`;
        }
        const tabPath = `/${username}/${tab.toLowerCase()}`;
        return pathname === tabPath;
    };

    const anyTabActive = tabs.some(tab => isTabActive(tab));

    return (
        <div className={`sticky top-0 z-10 bg-white flex flex-col w-full border-b border-gray-200 ${style}`}>
            <div className="flex">
                {tabs.map((tab, index) => {
                    const isActive = anyTabActive ? isTabActive(tab) : index === 0;

                    return useLink ? (
                        <Link
                            key={index}
                            className={buttonStyles}
                            href={index == 0 ? `/${username}` : `/${username}/${tab.toLowerCase()}`}
                        >
                            <button
                                className={`hover:cursor-pointer ${isActive ? "text-black" : "text-gray-500"}`}
                            >
                                <span className={spanStyles}>
                                    {tab}
                                    {isActive && <div className={underlineStyles}></div>}
                                </span>
                            </button>
                        </Link>
                    ) : (
                        <button
                            key={index}
                            className={`${buttonStyles} 
                        ${index === currentTab ? "text-black" : "text-gray-500"}`}
                            onClick={() => setCurrentTab?.(index)}>
                            <span className={spanStyles}>
                                {tab}
                                {index === currentTab && <div className={underlineStyles}></div>}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

export default TabSwitcher;