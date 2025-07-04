import { auth } from "@/auth";
import HomeWrapper from "@/components/home/HomeWrapper"
import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/userType";

export default async function Page() {
    const session = await auth();

    let user;

    if (session) {
        user = await prisma.users.findUnique({
            where: {
                UserID: parseInt(session?.user.id)
            },
            select: {
                UserID: true,
                Username: true,
                DisplayName: true,
                Website: true,
                Location: true,
                ProfilePicture: true,
                CoverPicture: true,
                Bio: true,
                followers: true,
                following: true,
            }
        });
    }

    return (
        <ProtectedRoute>
            <Layout>
                <HomeWrapper user={user!} />
            </Layout>
        </ProtectedRoute>
    );
}