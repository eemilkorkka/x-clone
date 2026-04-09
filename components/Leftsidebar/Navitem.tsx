"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getSelectedSection } from "./section";

interface NavitemProps {
    href?: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    label?: string;
    styles?: string;
}

export const Navitem = ({ href, icon, activeIcon, label, styles }: NavitemProps) => {

    const pathname = usePathname();
    const { data } = authClient.useSession();
    const urlPattern = `^/${data?.user.username}/([^/]+)$`

    const isActive = label === "Profile" ? pathname.match(urlPattern) || pathname === href 
    : getSelectedSection(pathname) === label;

    const className = cn(
        "w-fit hover:bg-ring/20 px-4 gap-4 min-w-15 min-h-15 md:min-h-13 rounded-full flex items-center text-lg",
        !href && "hover:cursor-not-allowed",
        isActive && "font-bold",
        styles
    );

    return href ? (
        <Link href={href} className={className} prefetch={label !== "Settings and privacy"}>
            {isActive ? activeIcon : icon}
            <span className="hidden xl:block">{label}</span>
        </Link>
    ) : (
        <button className={className}>
            {isActive ? activeIcon : icon}
            <span className="hidden xl:block">{label}</span>
        </button>
    )
}