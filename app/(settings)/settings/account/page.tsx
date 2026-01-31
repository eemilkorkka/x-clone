import { FeedHeader } from "@/components/Feed/FeedHeader"
import { ReturnBack } from "@/components/ReturnBack"
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation";
import { IoPersonOutline } from "react-icons/io5";
import { LuKeyRound } from "react-icons/lu";
import { LiaHeartBrokenSolid } from "react-icons/lia";
import { TwoFactorAuthSetting } from "@/components/Settings/2FASetting/2FASetting";

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
                title={"Account information"}
                description={"See your current account information like your username and email address."}
                icon={<IoPersonOutline className="text-zinc-500 size-6" />}
                href="/settings/your_twitter_data/account"
                styles="mt-3 pl-8"
            />

            <SettingsItem
                title={"Change your password"}
                description={"Change your password at any time."}
                icon={<LuKeyRound className="text-zinc-500 size-6" />}
                href="/settings/account/change_password"
                styles="mt-3 pl-8"
            />

            <TwoFactorAuthSetting />    

            <SettingsItem
                title={"Deactivate your account"}
                description={"Find out how you can deactivate your account."}
                icon={<LiaHeartBrokenSolid className="text-zinc-500 size-6" />}
                href="/settings/deactivate"
                styles="mt-3 pl-8"
            />
        </div>
    )
}