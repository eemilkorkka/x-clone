import { FeedHeader } from "@/components/Feed/FeedHeader"
import { ReturnBack } from "@/components/ReturnBack"

export default function AccountPage() {
    return (
        <div>
            <FeedHeader styles="flex items-center px-2 lg:px-8 border-b-0">
                <div className="flex items-center gap-6">
                    <ReturnBack styles="flex lg:hidden" />
                    <h2 className="text-xl font-bold pt-2">Your account</h2>
                </div>
            </FeedHeader>
            <p className="text-zinc-500 text-sm mt-6 px-8">See information about your account, download an archive of your data, or learn about your account deactivation options</p>
        </div>
    )
}