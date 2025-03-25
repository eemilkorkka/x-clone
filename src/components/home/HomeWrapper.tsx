"use client";
import { useState } from "react";
import TabSwitcher from "../shared/TabSwitcher";
import TweetBox from "./TweetBox/TweetBox";
import Tweet from "./Tweet/Tweet";

const HomeWrapper = () => {
    const tabs: string[] = ["For you", "Following"];
    const [currentTab, setCurrentTab] = useState<number>(0);

    return (
        <>
            <TabSwitcher tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <TweetBox />
            <Tweet 
                content="Hello X! This is my first post here." 
                displayName={"Eemil Korkka"} 
                username="eemilkorkka"
                statValues={[3, 5, 30]}
             />
        </>
    );
}

export default HomeWrapper;