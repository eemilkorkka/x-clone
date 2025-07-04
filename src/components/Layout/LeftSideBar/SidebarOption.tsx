"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarOptionProps {
    text?: string;
    href?: string;
    lightIcon: ReactNode;
    darkIcon?: ReactNode;
    style?: string;
    isMobileSideBar?: boolean
}

const SideBarOption = ({ text, href, lightIcon, darkIcon, style, isMobileSideBar = false }: SideBarOptionProps) => {

    const currentPath = usePathname();
    const isActive: boolean = currentPath === href;

    const buttonElement = (
        <button className={`flex gap-5 justify-center text-xl rounded-full hover:bg-gray-200 
                hover:cursor-pointer focus:outline-none p-2.5  xl:pl-3 xl:pr-8 ${isActive || isMobileSideBar ? "font-bold" : "font-normal"} ${style}`}>
            {darkIcon ? (isActive ? darkIcon : lightIcon) : lightIcon}
            <span className={`${!isMobileSideBar && "hidden" } xl:inline`}>{text}</span>
        </button>
    );

    return (
        <div>
            {!href ? (
                buttonElement
            ) : (
                <Link href={href} className="flex justify-center xl:justify-start">
                    {buttonElement}
                </Link>
            )}
        </div>
    );
}

export default SideBarOption;