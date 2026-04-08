import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ui/ReturnBack";
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Account information",
}

export default async function YourTwitterDataAccountPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    const hasSetBirthDate = session.user.birthDateDay && session.user.birthDateMonth && session.user.birthDateYear;

    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-xl font-bold">Account information</h1>
            </FeedHeader>

            <SettingsItem
                title="Username"
                description={`@${session.user.username}`}
                href="/settings/screen_name"
            />

            <SettingsItem
                title="Email"
                description={session.user.email}
                href="/settings/email"
            />

            <SettingsItem
                title="Birth date"
                description={
                    <>
                        {hasSetBirthDate && (
                            <>
                                {session.user.birthDateMonth?.slice(0, 3)} {session.user.birthDateDay}, {session.user.birthDateYear}
                                <br />
                            </>
                        )}
                        Change your date of birth on your profile.
                    </>
                }
                href="/settings/profile"
            />
        </div>
    )
}