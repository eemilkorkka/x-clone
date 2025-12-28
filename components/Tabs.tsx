import React from "react";
import { Button } from "./ui/button";

interface TabsProps {
    tabs: { href?: string; label: string }[];
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

export const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
    return (
        <div className="flex w-full">
            {tabs.map((tab, index) => (
                <React.Fragment key={index}>
                    <Button
                        variant="ghost"
                        className="flex-1 w-full h-full hover:cursor-pointer"
                        onClick={() => setActiveTab(index)}
                    >
                        <div className="relative">
                            <p className={activeTab === index ? "font-bold" : "text-gray-500"}>{tab.label}</p>
                            {activeTab === index && (
                                <div className="absolute w-full top-8 left-0 right-0 h-1 bg-sky-500 rounded-full"></div>
                            )}
                        </div>
                    </Button>
                </React.Fragment>
            ))}
        </div>
    )
}