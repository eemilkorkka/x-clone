import React, { SetStateAction } from "react";
import { FeedHeader } from "../Feed/FeedHeader"
import { Tabs } from "../ui/Tabs"
import useWindowWidth from "@/hooks/useWindowWidth";
import { FaXTwitter } from "react-icons/fa6";
import { MobileLeftSidebar } from "../Leftsidebar/MobileLeftSidebar";

const tabs = [
    { label: "For you" },
    { label: "Following" }
];

interface HomeHeaderProps {
    feed: string;
    setFeed: React.Dispatch<SetStateAction<string>>;
}

export const HomeHeader = ({ feed, setFeed }: HomeHeaderProps) => {

    const width = useWindowWidth();
    const activeTab = feed === "following" ? "Following" : "For you";

    const changeTab = (tab: string) => {
        setFeed(tab.replace(" ", "").toLowerCase());
    }

    return (
        <FeedHeader styles="flex-col items-start backdrop-blur-lg bg-background/80">
            {width && width < 500 && (
                <div className="flex items-center">
                    <MobileLeftSidebar />
                    <FaXTwitter size={28} className="absolute left-1/2 -translate-x-1/2" />
                </div>
            )}
            <Tabs tabs={tabs} activeTab={activeTab} changeTab={changeTab} />
        </FeedHeader>
    )
}