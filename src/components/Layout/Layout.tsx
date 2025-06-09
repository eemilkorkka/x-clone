import { ReactNode } from "react";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import SearchBar from "../Shared/SearchBar";
import TweetsContextProvider from "@/Context/TweetsContext";
import Widget from "../Shared/Widget";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UserCard from "../Shared/UserCard";
import Button from "../Shared/Button";
import Link from "next/link";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";

const Layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();
    const headersList = headers();

    const pathname = (await headersList).get("x-url") || "";
    const endpoint = pathname.split("//")[1].slice(14, pathname.length - 1);
    const isViewingASpecificTweet = /^\/[^/]+\/status\/\d+$/.test(endpoint);
    const username = isViewingASpecificTweet && endpoint.split("/")[1];

    const users = await prisma.users.findMany({
        take: 3,
        where: {
            Username: {
                not: session?.user?.username
            }
        }
    });

    const user = username && await prisma.users.findUnique({
        where: {
            Username: username
        },
        select: {
            ProfilePicture: true,
            DisplayName: true,
            Bio: true
        }
    });

    return (
        <TweetsContextProvider>
            <div className="flex flex-col-reverse mobile:flex-row w-full max-w-fit mx-auto overflow-y-auto">
                <div className="shrink-0 flex w-18 xl:w-65 px-2">
                    <LeftSideBar />
                </div>
                <div className="flex w-full min-w-0 gap-8">
                    <div className="w-3xl md:w-[598px] h-screen border-r border-l border-gray-200 overflow-y-scroll no-scrollbar" id="main-scroll-container">
                        {children}
                    </div>
                    <div className="hidden lg:flex flex-col gap-4 flex-shrink-0">
                        <SearchBar />
                        {!isViewingASpecificTweet && (
                            <Widget title="Subscribe to Premium">
                                <div className="ps-3 p-2 pt-0">
                                    <p className="text-sm text-gray-500">Subscribe to unlock new features and if eligible, <br></br> receive a share of revenue.
                                    </p>
                                    <Button style="text-sm px-4 pt-2 pb-2 mt-2">Subscribe</Button>
                                </div>
                            </Widget>
                        )}
                        <Widget title={isViewingASpecificTweet ? "Relevant people" : "Who to follow"}>
                            {isViewingASpecificTweet ? (
                                user && (
                                    <Link href={`/${username}`}>
                                        <div className="hover:bg-gray-100 hover:cursor-pointer w-full p-2">
                                            <UserCard
                                                image={user.ProfilePicture}
                                                username={username}
                                                displayName={user.DisplayName}
                                                style="flex-col"
                                                bio={user.Bio ?? undefined}
                                            >
                                                {username !== session?.user.username && (
                                                    <Button variant="black" hoverColor="white" style="text-sm px-4 pt-2 pb-2">Follow</Button>
                                                )}
                                            </UserCard>
                                        </div>
                                    </Link>
                                )
                            ) : (
                                users.map((user) => (
                                    <Link key={user.Username} href={`/${user.Username}`}>
                                        <div className="hover:bg-gray-100 hover:cursor-pointer w-full p-2">
                                            <UserCard
                                                image={user.ProfilePicture}
                                                username={user.Username}
                                                displayName={user.DisplayName}
                                            >
                                                <Button variant="black" hoverColor="white" style="text-sm px-4 pt-2 pb-2">Follow</Button>
                                            </UserCard>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </Widget>
                    </div>
                </div>
                <Toaster position="bottom-center" />
            </div>
        </TweetsContextProvider>
    );
}

export default Layout;