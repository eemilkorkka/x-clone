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
        <ProfileFeedWrapper type="tweets" username={username} displayName={user?.DisplayName ?? username} />
    );
}
