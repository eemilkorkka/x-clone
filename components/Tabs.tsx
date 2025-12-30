import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface TabsProps {
    tabs: { href?: string; label: string }[];
    activeTab: string;
    changeTab: (tab: string) => void;
}

export const Tabs = ({ tabs, activeTab, changeTab }: TabsProps) => {

    const renderTabElement = (index: number) => {
        const isActive = activeTab === tabs[index].label;
        
        return (
            <Button
                variant="ghost"
                className="flex-1 w-full h-full hover:cursor-pointer"
                onClick={() => changeTab(tabs[index].label)}
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
        <div className="flex w-full">
            {tabs.map((tab, index) => (
                <React.Fragment key={tab.label}>
                    {tab.href ? (
                        <Link href={tab.href} className="flex-1">
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