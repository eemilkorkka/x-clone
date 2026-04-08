import { FeedHeader } from "@/components/Feed/FeedHeader";
import { MobileOnlyPageWrapper } from "@/components/MobileOnlyPageWrapper";
import { ReturnBack } from "@/components/ui/ReturnBack";
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { Username } from "@/components/User/Username";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Settings",
}

export default async function SettingsPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return (
        <MobileOnlyPageWrapper redirectUrl="/settings/account">
            <div className="space-y-4">
                <FeedHeader styles="flex px-2 gap-6 items-center border-b-0">
                    <ReturnBack />
                    <div>
                        <h1 className="font-bold text-lg">Settings</h1>
                        <Username username={session?.user?.username ?? ""} useLink={false} />
                    </div>
                </FeedHeader>
                <div>
                    <SettingsItem
                        href="/settings/account"
                        title="Your account"
                    />
                    <SettingsItem
                        href="/settings/accessibility_display_and_languages"
                        title="Accessibility, display, and languages"
                    />
                </div>
            </div>
        </MobileOnlyPageWrapper>
    )
}