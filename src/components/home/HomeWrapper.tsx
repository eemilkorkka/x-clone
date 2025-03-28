"use client";
import { useState } from "react";
import TabSwitcher from "../shared/TabSwitcher";
import TweetBox from "./TweetBox/TweetBox";

const HomeWrapper = () => {
    const tabs: string[] = ["For you", "Following"];
    const [currentTab, setCurrentTab] = useState<number>(0);

    return (
        <>
            <TabSwitcher tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <TweetBox />
        </>
    );
}

export default HomeWrapper;