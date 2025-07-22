import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Profile from "@/components/Profile/Profile";
import { prisma } from "@/lib/prisma";
import ProfileFeedWrapper from "@/components/Profile/ProfileFeedWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const session = await auth();
    const { username } = await params;

    const userId = await prisma.users.findUnique({
        where: {
            Username: username
        },
        select: {
            UserID: true
        }
    });

    const likes = userId && await prisma.likes.count({
        where: {
            UserID: userId.UserID
        }
    });

    if (username !== session?.user.username) redirect(`/${username}`);

    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username} likesCount={likes || 0}>
                    <ProfileFeedWrapper type="like" username={username} displayName={session.user.name} userId={userId?.UserID} />
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}