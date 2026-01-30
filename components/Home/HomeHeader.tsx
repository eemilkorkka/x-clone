import React, { SetStateAction, useState } from "react";
import { FeedHeader } from "../Feed/FeedHeader"
import { Tabs } from "../Tabs"
import useWindowWidth from "../useWindowWidth";
import { CustomAvatar } from "../User/CustomAvatar";
import { authClient } from "@/lib/auth-client";
import { FaXTwitter } from "react-icons/fa6";

const tabs = [
    { label: "For you" },
    { label: "Following" }
];

interface HomeHeaderProps {
    setFeed: React.Dispatch<SetStateAction<string>>;
}

export const HomeHeader = ({ setFeed }: HomeHeaderProps) => {

    const width = useWindowWidth();
    const { data } = authClient.useSession();
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const changeTab = (tab: string) => {
        setActiveTab(tab);
        setFeed(tab.replace(" ", "").toLowerCase());
    }

    return (
        <FeedHeader styles="flex-col backdrop-blur-lg bg-background/80">
            {width && width < 500 && (
                <div className="flex items-center">
                    <CustomAvatar
                        src={data?.user?.image ?? ""}
                        alt={``} size="sm"
                        useLink={false}
                        styles="mx-4 mt-3 mb-1"
                    />
                    <FaXTwitter size={28} className="absolute left-1/2 -translate-x-1/2" />
                </div>
            )}
            <Tabs tabs={tabs} activeTab={activeTab} changeTab={changeTab} />
        </FeedHeader>
    )
}