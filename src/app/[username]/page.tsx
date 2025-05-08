import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import ProfilePicture from "../../components/Profile/ProfilePicture";
import DisplayName from "@/components/Profile/DisplayName";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import Button from "@/components/shared/Button";
import { auth } from "@/auth";
import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import { prisma } from "@/lib/prisma";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const response = await fetch(`http://localhost:3000/api/users/${username}`);
    const data = await response.json();
    const session = await auth();

    const numberOfPosts = await prisma.posts.count({
        where: {
            users: {
                Username: username,
            },
        },
    });

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
                                <DisplayName displayName={data.user.DisplayName} />
                                <span className="text-gray-500 text-sm">{numberOfPosts} posts</span>
                            </>
                        ) : (
                            <span className="font-bold text-lg">Profile</span>
                        )}
                    </div>
                </div>
                <ProfileBanner image={data.user?.CoverPicture}>
                    <ProfilePicture image={data.user?.ProfilePicture} style="w-full h-full max-w-[133px] max-h-[133px] absolute left-4 -translate-y-1/2 border-4 border-white bg-white" />
                </ProfileBanner>
                <div className="flex justify-end mt-4 pr-4">
                    {data.user && (
                        <>
                            {session?.user?.username === username ? (
                                <Button variant="outline" textColor="black" hoverColor="gray" style="text-sm px-4 pt-2 pb-2 border-gray-300!">Edit Profile</Button>
                            ) : (
                                <Button variant="black" style="text-sm px-4 pt-2 pb-2">Follow</Button>
                            )}
                        </>
                    )}
                </div>
                <div className={`flex flex-col pl-4 ${data.user ? "mt-7" : "mt-15"}`}>
                    {data.user ? (
                        <div className="flex flex-col gap-4">
                            <ProfileInfo
                                displayName={data.user.DisplayName}
                                username={data.user.Username}
                                bio={data.user.Bio}
                                followers={0}
                                following={0}   
                            />
                            <div className="-ml-4">
                                <ProfileWrapper username={username} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <DisplayName displayName={data.user?.DisplayName ?? `@${username}`} />
                            <div className="flex flex-col gap-2 mt-25 h-full mx-25">
                                <p className="text-3xl font-extrabold">{data.message}</p>
                                <p className="text-gray-500">Try searching for another.</p>
                            </div>
                        </>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
