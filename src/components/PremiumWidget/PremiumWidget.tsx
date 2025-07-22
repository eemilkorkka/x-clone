"use client";
import Widget from "../Shared/Widget";
import Button from "../Button/Button";
import { useContext } from "react";
import { DisplayContext } from "@/Context/DisplayContext";
import { bgColors } from "../Layout/LeftSideBar/DisplayDialog/DisplayDialog";

const PremiumWidget = () => {
    
    const { selectedIndex } = useContext(DisplayContext)!;

    return (
        <Widget title="Subscribe to Premium">
            <div className="ps-3 p-2 pt-0">
                <p className="text-sm text-gray-500">Subscribe to unlock new features and if eligible, <br /> receive a share of revenue.
                </p>

                <Button styles={`text-sm px-4 pt-2 pb-2 mt-2 ${bgColors[selectedIndex ?? 0].color}`}>Subscribe</Button>
            </div>
        </Widget>
    )
}

export default PremiumWidget;