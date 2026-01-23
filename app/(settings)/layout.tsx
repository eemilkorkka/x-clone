import { Leftsidebar } from "@/components/Leftsidebar/Leftsidebar";
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Your Account / X Clone",
        template: "%s / X Clone",
    },
    description: "Settings and account management on X Clone.",
}

export default function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col-reverse mobile:flex-row w-full max-w-fit mx-auto">
            <div className="shrink-0 flex w-18 xl:w-69">
                <Leftsidebar />
            </div>

            <section className="flex w-full min-w-0">
                <div className="hidden lg:block lg:w-[350px] xl:w-[448px] h-full border-r border-l border-gray-200">
                    <h2 className="text-xl font-bold p-4">Settings</h2>
                    <SettingsItem
                        href="/settings/account"
                        title="Your account"
                    />
                    <SettingsItem
                        href="/settings/accessibility_display_and_languages"
                        title="Accessibility, display, and languages"
                    />
                </div>
                <aside className="w-3xl md:w-[599px] border-l lg:border-l-0 md:border-r border-gray-200 lg:flex flex-col gap-4 py-2">
                    {children}
                </aside>
            </section>
        </main>
    )
}