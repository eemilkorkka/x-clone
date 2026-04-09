import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ui/ReturnBack";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
    return (
        <div className="flex flex-col gap-6">
            <FeedHeader>
                <ReturnBack />
                <h1 className="text-lg font-bold">Bookmarks</h1>
            </FeedHeader>
            <LoadingSpinner />
        </div>
    )
}