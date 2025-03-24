"use client";
import { Dispatch, SetStateAction, useState } from "react";

interface TabsSwitcherProps {
    tabs: string[];
    currentTab: number;
    setCurrentTab: Dispatch<SetStateAction<number>>;
}

const TabsSwitcher = ({ tabs, currentTab, setCurrentTab }: TabsSwitcherProps) => {
    return (
        <div className="flex w-full border-b border-gray-200">
            {tabs.map((tab, index) => {
                return (
                    <button 
                        className={`w-full flex justify-center h-13 font-bold hover:bg-gray-200 hover:cursor-pointer 
                            ${index === currentTab ? "text-black" : "text-gray-500"}`} 
                        onClick={() => setCurrentTab(index)}>
                            <span className="relative flex flex-col w-fit justify-center h-full">
                                {tab}
                                { index === currentTab && <div className="w-full h-1 absolute bottom-0 bg-xblue rounded-full"></div> }
                            </span>
                    </button>
                );
            })}
        </div>
    );
}

export default TabsSwitcher;