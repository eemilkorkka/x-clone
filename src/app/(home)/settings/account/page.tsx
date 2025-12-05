import FeedHeader from "@/components/Shared/FeedHeader";
import { IoPersonOutline } from "react-icons/io5";
import Link from "next/link";

export default async function Page() {
    return (
        <>
            <FeedHeader title="Your account" />
            <Link href="/settings/account/username" className="flex p-2 px-8 items-center gap-10 hover:bg-gray-100 hover:cursor-pointer">
                <IoPersonOutline size={20} />
                <div className="flex flex-col gap-1">
                    <span>Change username</span>
                    <span className="text-sm text-gray-500">Change your username at any time.</span>
                </div>
            </Link>
        </>
    );
}