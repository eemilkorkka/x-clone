import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Profile from "@/components/Profile/Profile";
import ProfileFeedWrapper from "@/components/Profile/ProfileFeedWrapper";
import { auth } from "@/auth";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await auth();

    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username}>
                    <ProfileFeedWrapper type="replies" username={username} displayName={session?.user.name ?? username} />
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}
