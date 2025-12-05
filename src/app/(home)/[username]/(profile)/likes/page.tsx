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

    if (username !== session?.user.username) redirect(`/${username}`);

    return (
        <ProfileFeedWrapper type="like" username={username} displayName={session.user.name} userId={userId?.UserID} />
    );
}