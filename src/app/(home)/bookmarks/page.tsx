import BookmarksWrapper from "@/components/bookmarks/BookmarksWrapper";
import FeedHeader from "@/components/Shared/FeedHeader";

export default async function Page() {
    return (
        <>
            <FeedHeader title="Bookmarks" />
            <BookmarksWrapper />
        </>
    );
}