"use client";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfilePicture from "../Profile/ProfilePicture";
import Button from "./Button";
import { useSession } from "next-auth/react";
import { BsTwitterX } from "react-icons/bs";

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
const underlineStyles = "w-full h-1 absolute bottom-0 bg-xblue rounded-full";

const TabSwitcher = ({ tabs, currentTab, setCurrentTab, useLink, username, style }: TabsSwitcherProps) => {
    const pathname = usePathname();
    const { data } = useSession();

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
            {pathname.split("/")[1] === "home" && (
                <div className="flex items-end w-full px-4 mobile:hidden">
                    <div className="w-2/3">
                        <div className="w-[32px] h-[32px]">
                            <ProfilePicture image={data?.user.image} href={`/${data?.user.username}`} />
                        </div>
                    </div>
                    <Link href="/home">
                        <button className="hover:bg-gray-200 p-2.5 hover:cursor-pointer rounded-full">
                            <BsTwitterX size="26" className="p-0.5" />
                        </button>
                    </Link>
                    <div className="w-2/3 flex justify-end">
                        <Button
                            variant="outline"
                            textColor="black"
                            style="px-4 text-sm p-2!"
                            hoverColor="gray"
                        >
                            Get Premium
                        </Button>
                    </div>
                </div>
            )}
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