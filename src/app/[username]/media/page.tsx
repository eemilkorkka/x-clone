import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import Profile from "@/components/Profile/Profile";
import ProfileFeedWrapper from "@/components/Profile/ProfileFeedWrapper";

export default async function Page({ params}: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username}>
                    <ProfileFeedWrapper type="media" username={username} />
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}