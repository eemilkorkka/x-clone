"use client";

import { useState } from "react";
import { FeedHeader } from "./FeedHeader"
import { Tabs } from "./Tabs"
import { TweetForm } from "./TweetForm";

export const HomeFeed = () => {

    const [activeTab, setActiveTab] = useState(0);

    return (
        <>
            <FeedHeader>
                <Tabs tabs={[{ label: "For you" }, { label: "Following" }]} activeTab={activeTab} setActiveTab={setActiveTab} />
            </FeedHeader>
            <TweetForm type="tweet" /> 
        </>
    )
}