import { SettingsItem } from "@/components/Settings/SettingsItem";
import { HiOutlinePaintBrush } from "react-icons/hi2";

export default function AccessabilityPage() {
    return (
        <div>
            <div className="px-8 space-y-6">
                <h2 className="text-xl font-bold pt-2">Accessibility, display, and languages</h2>
                <p className="text-zinc-500 text-sm">Manage how X content is displayed to you.</p>
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