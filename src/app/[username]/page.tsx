import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import ProfileBanner from "@/components/profile/ProfileBanner";
import ProfilePicture from "@/components/shared/ProfilePicture";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const response = await fetch(`http://localhost:3000/api/users/${username}`);
    const data = await response.json();

    return (
        <ProtectedRoute>
            <Layout>
                <div className="flex gap-8 ps-4 items-center pt-2 pb-2">
                    <Link className="rounded-full h-fit p-2 hover:bg-gray-200 hover:cursor-pointer" href="/home">
                        <FaArrowLeft size={18} />
                    </Link>
                    <div className="flex flex-col">
                        {data.user ? (
                            <>
                                <span className="font-bold text-lg">{data.user.DisplayName}</span>
                                <span className="text-gray-500 text-sm">55 posts</span>
                            </>
                        ) : (
                            <span className="font-bold text-lg">Profile</span>
                        )}
                    </div>
                </div>
                <ProfileBanner image={"https://pbs.twimg.com/profile_banners/1883545813210546176/1739222488/600x200"}>
                    <ProfilePicture image={data.user?.ProfilePicture} style="w-full h-full max-w-[133px] max-h-[133px] absolute left-4 -translate-y-1/2 border-4 border-white" />
                </ProfileBanner>
            </Layout>
        </ProtectedRoute>
    );
}
