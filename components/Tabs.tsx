"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useColor } from "@/context/ColorContext";

interface TabsProps {
    tabs: { href?: string; label: string }[];
    activeTab?: string;
    changeTab?: (tab: string) => void;
    styles?: string;
}

export const Tabs = ({ tabs, activeTab, changeTab, styles }: TabsProps) => {
    const pathname = usePathname();
    const { colors } = useColor();

    const renderTabElement = (index: number) => {
        const isActive = activeTab ? activeTab === tabs[index].label 
        : tabs[index].href === pathname;
        
        return (
            <Button
                variant="ghost"
                className="flex-1 w-full h-full hover:cursor-pointer rounded-none"
                onClick={() => changeTab?.(tabs[index].label)}
            >
                <div className="relative">
                    <p className={cn("text-[15px]", isActive ? "font-bold" : "text-gray-500")}>
                        {tabs[index].label}
                    </p>
                    {isActive && (
                        <div className={cn("absolute w-full top-8 left-0 right-0 h-1", colors.color, "rounded-full")} />
                    )}
                </div>
            </Button>
        );
    }

    return (
        <div className={cn("flex w-full h-13", styles)}>
            {tabs.map((tab, index) => (
                <React.Fragment key={tab.label}>
                    {tab.href ? (
                        <Link href={tab.href} className="flex-1 h-full">
                            {renderTabElement(index)}
                        </Link>
                    ) : (
                        renderTabElement(index)
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};