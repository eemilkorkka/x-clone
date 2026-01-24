import { FeedHeader } from "@/components/Feed/FeedHeader"
import { ReturnBack } from "@/components/ReturnBack"
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation";
import { IoPersonOutline } from "react-icons/io5";

export default async function AccountPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return (
        <div>
            <FeedHeader styles="flex gap-6 items-center px-2 lg:px-8 border-b-0">
                <ReturnBack styles="flex lg:hidden" />
                <h1 className="text-xl font-bold pt-2">Your account</h1>
            </FeedHeader>
            <p className="text-zinc-500 text-sm mt-6 px-8">See information about your account, download an archive of your data, or learn about your account deactivation options</p>
            <SettingsItem
                title="Account information"
                description="See your current account information like your username and email address."
                icon={<IoPersonOutline className="text-zinc-500 size-6" />}
                styles="mt-2"
                href="/settings/your_twitter_data/account"
            />
        </div>
    )
}