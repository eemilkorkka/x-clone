"use server";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import DisplayName from "./DisplayName";
import ProfileBanner from "./ProfileBanner";
import ProfilePicture from "./ProfilePicture";
import ProfileInfo from "./ProfileInfo";
import Button from "../shared/Button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ReactNode } from "react";
import TabSwitcher from "../shared/TabSwitcher";

interface ProfileProps {
    username: string;
    likesCount?: number; 
    children: ReactNode;
}

const Profile = async ({ username, likesCount, children }: ProfileProps) => {
    const session = await auth();

    const numberOfPosts = await prisma.posts.count({
        where: {
            users: {
                Username: username,
            },
        },
    });

    const user = await prisma.users.findFirst({
        where: {
            Username: username
        },
        select: {
            Username: true,
            DisplayName: true,
            Website: true,
            Location: true,
            ProfilePicture: true,
            CoverPicture: true,
            Bio: true
        }
    });

    const profileTabs = [
        "Posts",
        "Replies",
        "Media",
        "Likes"
    ];

    return (
        <>
            <div className="flex gap-8 ps-4 items-center pt-2 pb-2 sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
                <Link className="rounded-full h-fit p-2 hover:bg-gray-200 hover:cursor-pointer" href="/home">
                    <FaArrowLeft size={18} />
                </Link>
                <div className="flex flex-col">
                    {user ? (
                        <>
                            <DisplayName displayName={user.DisplayName} />
                            <span className="text-gray-500 text-sm">
                                {likesCount ? (
                                    `${likesCount} likes`
                                ) : (
                                    `${numberOfPosts} posts`
                                )}
                            </span>
                        </>
                    ) : (
                        <span className="font-bold text-lg">Profile</span>
                    )}
                </div>
            </div>
            <ProfileBanner image={user?.CoverPicture ?? undefined}>
                <ProfilePicture image={user?.ProfilePicture} style="w-full h-full max-w-[133px] max-h-[133px] absolute left-4 -translate-y-1/2 border-4 border-white bg-white" />
            </ProfileBanner>
            <div className="flex justify-end mt-4 pr-4">
                {user && (
                    <>
                        {session?.user?.username === username ? (
                            <Button variant="outline" textColor="black" hoverColor="gray" style="text-sm px-4 pt-2 pb-2 border-gray-300!">Edit Profile</Button>
                        ) : (
                            <Button variant="black" style="text-sm px-4 pt-2 pb-2">Follow</Button>
                        )}
                    </>
                )}
            </div>
            <div className={`flex flex-col pl-4 ${user ? "mt-7" : "mt-15"}`}>
                {user ? (
                    <div className="flex flex-col gap-4">
                        <ProfileInfo
                            displayName={user.DisplayName}
                            username={user.Username}
                            bio={user.Bio ?? ""}
                            followers={0}
                            following={0}
                        />
                        <div className="-ml-4">
                            <TabSwitcher 
                                tabs={username === session?.user.username ? profileTabs : profileTabs.slice(0, profileTabs.length - 1)}
                                useLink={true}
                                username={username}
                                style={"border-b-0! static!"}
                            />
                            {children}
                        </div>
                    </div>
                ) : (
                    <>
                        <DisplayName displayName={`@${username}`} />
                        <div className="flex flex-col gap-2 mt-25 h-full mx-25">
                            <p className="text-3xl font-extrabold">This account doesn't exist</p>
                            <p className="text-gray-500">Try searching for another.</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Profile;