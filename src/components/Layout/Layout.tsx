import { ReactNode } from "react";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import SearchBar from "../Shared/SearchBar";
import PostDialogContextProvider from "@/Context/PostDialogContext";
import Widget from "../Shared/Widget";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";
import UserSuggestion from "../Shared/UserSuggestion";
import TrendingWidget from "../Trending/TrendingWidget";
import QueryKeysContextProvider from "@/Context/QueryKeysContext";
import Button from "../Button/Button";
import FloatingPostButton from "../Button/FloatingPostButton/FloatingPostButton";

const Layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();
    const headersList = headers();

    const pathname = (await headersList).get("x-url")?.split("//") || "";
    const endpoint = pathname[1].slice(pathname[1].split("/")[0].length);
    const isViewingASpecificTweet = /^\/[^/]+\/status\/\d+$/.test(endpoint);

    const username = endpoint.split("/")[1];

    const users = session && await prisma.users.findMany({
        take: 3,
        where: {
            Username: {
                notIn: [session.user.username, username]
            },
            NOT: {
                followers: {
                    some: {
                        followerId: parseInt(session.user.id)
                    }
                }
            }
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
            followers: true,
            following: true,
        }
    });

    const user = username && await prisma.users.findUnique({
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
            followers: true,
            following: true,
        }
    });

    return (
        <QueryKeysContextProvider>
            <PostDialogContextProvider>
                {!isViewingASpecificTweet && (
                    <FloatingPostButton />
                )}
                <div className="flex flex-col-reverse mobile:flex-row w-full max-w-fit mx-auto overflow-y-auto">
                    <div className="shrink-0 flex w-18 xl:w-65 px-2">
                        <LeftSideBar />
                    </div>
                    <div className="flex w-full min-w-0 gap-8">
                        <div className="w-3xl md:w-[598px] h-full border-r border-l border-gray-200 overflow-y-scroll no-scrollbar" id="main-scroll-container">
                            {children}
                        </div>
                        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 pb-8">
                            <SearchBar />
                            {!isViewingASpecificTweet && (
                                <Widget title="Subscribe to Premium">
                                    <div className="ps-3 p-2 pt-0">
                                        <p className="text-sm text-gray-500">Subscribe to unlock new features and if eligible, <br /> receive a share of revenue.
                                        </p>

                                        <Button styles={`text-sm px-4 pt-2 pb-2 mt-2`}>Subscribe</Button>
                                    </div>
                                </Widget>
                            )}
                            {isViewingASpecificTweet ? (
                                user && (
                                    <Widget title="Relevant people">
                                        <Link href={`/${username}`}>
                                            <div className="hover:bg-gray-100 hover:cursor-pointer w-full p-2">
                                                <UserSuggestion
                                                    user={user}
                                                    username={username}
                                                    showBio={true}
                                                    session={session}
                                                />
                                            </div>
                                        </Link>
                                    </Widget>
                                )
                            ) : (
                                users && users.length > 0 && (
                                    <Widget title="Who to follow">
                                        {users.map((user) => (
                                            <Link key={user.Username} href={`/${user.Username}`}>
                                                <div className="hover:bg-gray-100 hover:cursor-pointer w-full p-2">
                                                    <UserSuggestion
                                                        user={user}
                                                        username={user.Username}
                                                        session={session}
                                                    />
                                                </div>
                                            </Link>
                                        ))}
                                    </Widget>
                                )
                            )}
                            <TrendingWidget />
                        </div>
                    </div>
                    <Toaster position="bottom-center" />
                </div>
            </PostDialogContextProvider>
        </QueryKeysContextProvider>
    );
}

export default Layout;