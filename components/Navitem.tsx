"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface NavitemProps {
    href: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    label?: string;
    styles?: string;
}

export const Navitem = ({ href, icon, activeIcon, label, styles }: NavitemProps) => {
    
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={twMerge(`w-fit hover:bg-ring/20 px-4 py-3 gap-4 rounded-full flex items-center text-lg ${isActive && "font-bold"}`, styles)}>
            {isActive ? activeIcon : icon}
            <span className="hidden xl:block">{label}</span>
        </Link>
    )
}