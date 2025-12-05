import FeedHeader from "@/components/Shared/FeedHeader";
import ChangeUsername from "@/components/ChangeUsername/ChangeUsername";
import Username from "@/components/Profile/Username";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    return (
        <div className="flex flex-col gap-4">
            <FeedHeader>
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-xl">Change username</span>
                    <Username username={session?.user.username ?? ""} />
                </div>
            </FeedHeader>
            <ChangeUsername session={session} />
        </div>
    );
}