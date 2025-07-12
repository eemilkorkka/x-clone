"use server";
import DisplayName from "./DisplayName";
import ProfileInfo from "./ProfileInfo";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Children, ReactNode } from "react";
import TabSwitcher from "../Shared/TabSwitcher";
import FeedHeader from "../Shared/FeedHeader";
import ProfileBanner from "./ProfileBanner";
import ProfilePicture from "./ProfilePicture";
import { months } from "@/utils/birthDateDropdowns";

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
            UserID: true,
            Username: true,
            DisplayName: true,
            Website: true,
            Location: true,
            ProfilePicture: true,
            CoverPicture: true,
            Bio: true,
            BirthDateDay: true,
            BirthDateMonth: true,
            BirthDateYear: true,
            created_at: true,
            followers: true,
            following: true
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
            <FeedHeader>
                <div className="flex flex-col">
                    {user ? (
                        <>
                            <DisplayName displayName={user.DisplayName} />
                            <span className="text-gray-500 text-sm">
                                {likesCount ? (
                                    likesCount > 1 ? `${likesCount} likes` : `${likesCount} like`
                                ) : (
                                    `${numberOfPosts} posts`
                                )}
                            </span>
                        </>
                    ) : (
                        <span className="font-bold text-lg">Profile</span>
                    )}
                </div>
            </FeedHeader>
            {!user && (
                <ProfileBanner>
                    <ProfilePicture image={undefined} style="w-full h-full max-w-[133px] max-h-[133px] absolute left-4 -translate-y-1/2 border-4 border-white bg-white" />
                </ProfileBanner>
            )}
            <div className={`flex flex-col px-4 ${user ? "mt-4" : "mt-18"}`}>
                {user ? (
                    <div className="flex flex-col gap-6">
                        <ProfileInfo
                            user={user}
                            session={session}
                            displayName={user.DisplayName}
                            username={user.Username}
                            coverPicture={user.CoverPicture ?? undefined}
                            bio={user.Bio ?? ""}
                            location={user.Location ?? ""}
                            website={user.Website ?? ""}
                            birthDateDay={user.BirthDateDay}
                            birthDateMonth={user.BirthDateMonth}
                            birthDateYear={user.BirthDateYear}
                            joinDate={`${[months[user.created_at.getMonth()]]} ${user.created_at.getFullYear()}`}
                            showJoinDate={true}
                            followers={user.followers}
                            following={user.following}
                        />
                        <div className="-ml-4 -mr-4">
                            <TabSwitcher
                                tabs={username === session?.user.username ? profileTabs : profileTabs.slice(0, profileTabs.length - 1)}
                                useLink={true}
                                username={username}
                                style={`${Children.count(children) === 0 ? "" : "border-b-0!"} static!`}
                            />
                            {children}
                        </div>
                    </div>
                ) : (
                    <>
                        <DisplayName displayName={`@${username}`} />
                        <div className="flex flex-col gap-2 mt-20 h-full w-full items-center">
                            <div className="flex flex-col gap-2">
                                <p className="text-2xl mobile:text-3xl font-extrabold whitespace-pre-wrap">{`This account doesn't\nexist`}</p>
                                <p className="text-gray-500">Try searching for another.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Profile;