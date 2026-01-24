import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { SettingsItem } from "@/components/Settings/SettingsItem";
import { Metadata } from "next";
import { HiOutlinePaintBrush } from "react-icons/hi2";

export const metadata: Metadata = {
    title: "Accessibility, display, and languages",
}

export default function AccessabilityPage() {
    return (
        <div>
            <div className="space-y-4">
                <FeedHeader styles="flex gap-6 px-2 lg:px-8 items-center border-b-0">
                    <ReturnBack styles="flex lg:hidden" />
                    <h2 className="text-xl font-bold">Accessibility, display, and languages</h2>
                </FeedHeader>
                <p className="text-zinc-500 text-sm px-10">Manage how X content is displayed to you.</p>
            </div>
            <SettingsItem
                href="/settings/display"
                title="Display"
                description="Manage aspects of your X experience such as limiting color contrast and motion."
                icon={<HiOutlinePaintBrush className="size-6 text-zinc-500" />}
                styles="mt-3 pl-8"
            />
        </div>
    )
}