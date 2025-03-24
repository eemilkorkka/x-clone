"use client";
import { useState } from "react";
import TabsSwitcher from "../shared/TabsSwitcher";

const HomeWrapper = () => {
    const tabs: string[] = ["For you", "Following"];
    const [currentTab, setCurrentTab] = useState<number>(0);

    return (
        <>
            <TabsSwitcher tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </>
    );
}

export default HomeWrapper;