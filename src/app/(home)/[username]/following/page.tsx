import FeedHeader from "@/components/Shared/FeedHeader";
import DisplayName from "@/components/Profile/DisplayName";
import { auth } from "@/auth";
import Username from "@/components/Profile/Username";
import TabSwitcher from "@/components/Shared/TabSwitcher";
import FollowList from "@/components/Profile/FollowList";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const session = await auth()
    const { username } = await params;

    return (
        <>
            <FeedHeader>
                <div className="flex flex-col">
                    <DisplayName displayName={session?.user.name ?? ""} />
                    <Username username={username} />
                </div>
            </FeedHeader>
            <TabSwitcher
                tabs={["Followers", "Following"]}
                currentTab={1}
                username={username}
                useLink={true}
            />
            <FollowList type={"following"} />
        </>
    )
}