import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { DeactivateAccount } from "@/components/Settings/Account/DeactivateAccount";
import { User } from "@/components/User/User";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DeactivateAccountPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-xl font-bold">Deactivate account</h1>
            </FeedHeader>
            <User user={session.user} styles="px-4" />
            <div className="space-y-4 px-4 mt-2">
                <h1 className="text-xl font-bold">This will deactivate your account</h1>
                <p className="text-zinc-500 mt-4 text-sm">
                    You're about to start the process of deactivating your account. Your display name, @username,
                    and public profile will no longer be viewable on X Clone.
                </p>
            </div>
            <DeactivateAccount />
        </div>
    )
}