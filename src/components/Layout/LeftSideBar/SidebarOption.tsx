"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarOptionProps {
    text?: string;
    href: string;
    lightIcon: ReactNode;
    darkIcon?: ReactNode;
    style?: string;
    disabled?: boolean;
}

const SideBarOption = ({ text, href, lightIcon, darkIcon, style, disabled = false }: SideBarOptionProps) => {

    const currentPath = usePathname();
    const isActive: boolean = currentPath === href;

    const buttonElement = (
        <button className={`flex gap-5 items-center justify-center text-xl rounded-full hover:bg-gray-200 
                hover:cursor-pointer p-2.5  xl:pl-3 xl:pr-8 ${isActive ? "font-bold" : "font-normal"} ${style}`}>
            {isActive ? darkIcon : lightIcon}
            <span className="hidden xl:inline">{text}</span>
        </button>
    );

    return (
        <div>
            {disabled ? (
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