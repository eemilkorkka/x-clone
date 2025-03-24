import HomeWrapper from "@/components/home/HomeWrapper";
import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import TabsSwitcher from "@/components/shared/TabsSwitcher";

export default async function Page() {
    console.log("yes");
    return (
        <ProtectedRoute>
            <Layout>
                <HomeWrapper />
            </Layout>
        </ProtectedRoute>
    );
}