import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import FeedHeader from "@/components/Shared/FeedHeader";
import BookmarksWrapper from "../../components/bookmarks/BookmarksWrapper";

export default async function Page() {
    return (
        <ProtectedRoute>
            <Layout>
                <FeedHeader title="Bookmarks" />
                <BookmarksWrapper />
            </Layout>
        </ProtectedRoute>
    );
}