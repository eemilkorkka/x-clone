"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { TrendingTopic } from "./TrendingTopic";
import { useColor } from "@/context/ColorContext";
import { authClient } from "@/lib/auth-client";

const trendingTopics = [
    {
        category: "Technology · Trending",
        title: "Google",
        postsCount: "287K"
    },
    {
        category: "Politics · Trending",
        title: "United States",
        postsCount: "1.2M"
    },
    {
        category: "Trending in Music",
        title: "Spotify Global",
        postsCount: "23.6K"
    },
    {
        category: "Politics · Trending",
        title: "Iran",
        postsCount: "531K"
    }
]

export const TrendingCard = () => {
    
    const { colors } = useColor();
    const { data } = authClient.useSession();

    if (!data) return null;

    return (
        <Card className="py-4 shadow-none bg-background border-1 border-foreground/10 ring-0 gap-2 pb-0">
            <CardHeader className="px-4">
                <CardTitle className="font-bold text-xl">What's happening</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {trendingTopics.map((topic, index) => (
                    <TrendingTopic
                        key={index}
                        category={topic.category}
                        title={topic.title}
                        postsCount={topic.postsCount}
                    />
                ))}
            </CardContent>
            <CardFooter className="p-4 hover:bg-ring/20 hover:cursor-pointer">
                <p className={colors.textColor}>Show more</p>
            </CardFooter>
        </Card>
    )
}