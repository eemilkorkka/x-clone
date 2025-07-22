import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Profile from "@/components/Profile/Profile";
import ProfileFeedWrapper from "@/components/Profile/ProfileFeedWrapper";
import { prisma } from "@/lib/prisma";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.users.findUnique({
        where: {
            Username: username
        },
        select: {
            DisplayName: true
        }
    });

    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username}>
                    <ProfileFeedWrapper type="tweets" username={username} displayName={user?.DisplayName ?? username} />
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}
