import HomeWrapper from "@/components/home/HomeWrapper"
import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";

export default async function Page() {
    return (
        <ProtectedRoute>
            <Layout>
                <HomeWrapper />
            </Layout>
        </ProtectedRoute>
    );
}