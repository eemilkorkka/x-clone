import HomeWrapper from "@/components/home/HomeWrapper";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default async function Page() {
    return (
        <ProtectedRoute>
            <Layout>
                <HomeWrapper />
            </Layout>
        </ProtectedRoute>
    );
}