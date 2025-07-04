"use server";
import React from "react";
import Image from "next/image";
import NFL from "../../../public/NFL.jpg";
import Widget from "../Shared/Widget";
import TrendingItem from "./TrendingItem";

const trendingTopics = [
    {
        title: "Elon Musk",
        postsAmount: "100K"
    },
    {
        title: "The US",
        postsAmount: "1.5M",
        category: "Politics"
    }, 
    {
        title: "iPhone",
        postsAmount: "20K",
        category: "Technology"
    }, 
    {
        title: "Ukraine",
        postsAmount: "50K",
        category: "Politics"
    }
];

const TrendingWidget = () => {
    return (
        <Widget title="What's happening">
            <div className="flex gap-2 p-3.5 hover:bg-gray-100 hover:cursor-pointer">
                <Image width={70} height={70} src={NFL} alt="NFL top 100" className="aspect-square object-cover rounded-xl" />
                <div className="flex flex-col">
                    <p className="font-semibold text-md">NFL Top 100 Countdown</p>
                    <span className="text-gray-500 text-sm">LIVE</span>
                </div>
            </div>
            {trendingTopics.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <TrendingItem 
                            title={item.title}
                            postsAmount={item.postsAmount}
                            category={item.category}
                        />
                    </React.Fragment>
                )
            })}
        </Widget>
    );
}

export default TrendingWidget;