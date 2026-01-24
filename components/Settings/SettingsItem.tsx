import Link from "next/link"
import React from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { cn } from "@/lib/utils";

interface SettingsItemProps {
    title: string;
    href: string;
    description?: string | React.ReactNode;
    icon?: React.ReactNode;
    styles?: string;
}

export const SettingsItem = ({ title, href, description, icon, styles }: SettingsItemProps) => {
    return (
        <Link href={href}>
            <Button variant="ghost" className={cn("font-normal w-full flex h-fit justify-between py-4 pl-4 rounded-none hover:cursor-pointer", styles)}>
                <div className="flex items-center gap-6">
                    {icon}
                    <div className="text-left">
                        <p className="text-base">{title}</p>
                        {description && typeof description === "string" ? (
                            <p className="text-zinc-500 text-sm text-wrap max-w-lg">{description}</p>
                        ) : (
                            <div className="text-zinc-500 text-sm text-wrap max-w-lg">{description}</div>
                        )}
                    </div>
                </div>
                <IoIosArrowForward className="text-zinc-500 size-5" />
            </Button>
        </Link>
    )
}