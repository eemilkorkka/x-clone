"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

    const isActive = () => {
        if (label === "Profile" && data?.user.username && pathname.includes(data.user.username)) {
            return pathname.match(urlPattern) || pathname === href;
        }

        return pathname === href;
    }

    const className = cn(
        "w-fit hover:bg-ring/20 px-4 py-3 gap-4 rounded-full flex items-center text-lg",
        !href && "hover:cursor-not-allowed",
        isActive() && "font-bold",
        styles
    );

    return href ? (
        <Link href={href} className={className}>
            {isActive() ? activeIcon : icon}
            <span className="hidden xl:block">{label}</span>
        </Link>
    ) : (
        <button className={className}>
            {isActive() ? activeIcon : icon}
            <span className="hidden xl:block">{label}</span>
        </button>
    )
}