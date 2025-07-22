import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import FeedHeader from "@/components/Shared/FeedHeader";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import DisplayDialog from "@/components/Layout/LeftSideBar/DisplayDialog/DisplayDialog";

export default async function Page() {
    return (
        <ProtectedRoute>
            <Layout>
                <div className="flex flex-col gap-4">
                    <FeedHeader>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-xl">Settings</span>
                        </div>
                    </FeedHeader>
                    <Link href="/settings/account" className="flex p-2 px-8 items-center gap-10 hover:bg-gray-100 hover:cursor-pointer">
                        <IoPersonOutline size={20} />
                        <div className="flex flex-col gap-1">
                            <span>Account settings</span>
                            <span className="text-sm text-gray-500">{"Manage your account's settings."}</span>
                        </div>
                    </Link>
                    <DisplayDialog>
                        <div className="flex p-2 px-8 items-center gap-10 hover:bg-gray-100 hover:cursor-pointer">
                            <HiOutlinePaintBrush size={23} />
                            <div className="flex flex-col gap-1">
                                <span>Display</span>
                                <span className="text-sm text-gray-500">Manage the appearance of your X experience.</span>
                            </div>
                        </div>
                    </DisplayDialog>
                </div>
            </Layout>
        </ProtectedRoute>
    )
}