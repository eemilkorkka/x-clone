"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface TabsProps {
    tabs: { href?: string; label: string }[];
    activeTab?: string;
    changeTab?: (tab: string) => void;
}

export const Tabs = ({ tabs, activeTab, changeTab }: TabsProps) => {
    const pathname = usePathname();

    const renderTabElement = (index: number) => {
        const isActive = activeTab ? activeTab === tabs[index].label 
        : tabs[index].href === pathname;
        
        return (
            <Button
                variant="ghost"
                className="flex-1 w-full h-full hover:cursor-pointer"
                onClick={() => changeTab?.(tabs[index].label)}
            >
                <div className="relative">
                    <p className={`text-[15px] ${isActive ? "font-bold" : "text-gray-500"}`}>
                        {tabs[index].label}
                    </p>
                    {isActive && (
                        <div className="absolute w-full top-8 left-0 right-0 h-1 bg-sky-500 rounded-full" />
                    )}
                </div>
            </Button>
        );
    }

    return (
        <div className="flex w-full h-13">
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