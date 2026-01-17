import { FeedHeader } from "@/components/Feed/FeedHeader";
import { MobileOnlyPageWrapper } from "@/components/MobileOnlyPageWrapper";
import { ReturnBack } from "@/components/ReturnBack";
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { Username } from "@/components/User/Username";
import { getSession } from "@/lib/session";

export default async function SettingsPage() {

    const session = await getSession();

    if (!session?.user?.username) {
        return null;
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