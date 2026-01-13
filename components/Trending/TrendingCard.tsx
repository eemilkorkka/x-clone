import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { TrendingTopic } from "./TrendingTopic";

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
        title: "Donald Trump",
        postsCount: "531K"
    }
]

export const TrendingCard = () => {
    return (
        <Card className="py-4 shadow-none border-1 border-foreground/10 ring-0 gap-2 pb-0">
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
            <CardFooter className="p-4 hover:bg-gray-100 hover:cursor-pointer">
                <p className="text-sky-500">Show more</p>
            </CardFooter>
        </Card>
    )
}