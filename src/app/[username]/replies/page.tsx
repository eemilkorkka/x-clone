import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Profile from "@/components/Profile/Profile";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username}>
                    replies
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}
