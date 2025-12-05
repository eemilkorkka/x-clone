import ProfileFeedWrapper from "@/components/Profile/ProfileFeedWrapper";
import { auth } from "@/auth";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await auth();

    return (
        <ProfileFeedWrapper type="media" username={username} displayName={session?.user.name ?? username} />
    );
}