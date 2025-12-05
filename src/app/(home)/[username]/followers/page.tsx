import FeedHeader from "@/components/Shared/FeedHeader";
import DisplayName from "@/components/Profile/DisplayName";
import Username from "@/components/Profile/Username";
import TabSwitcher from "@/components/Shared/TabSwitcher";
import FollowList from "@/components/Profile/FollowList";
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
        <>
            <FeedHeader>
                <div className="flex flex-col">
                    <DisplayName displayName={user?.DisplayName ?? ""} />
                    <Username username={username} />
                </div>
            </FeedHeader>
            <TabSwitcher
                tabs={["Followers", "Following"]}
                currentTab={0}
                username={username}
                useLink={true}
            />
            <FollowList type={"followers"} />
        </>
    )
}