import { ReactNode } from "react";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import SearchBar from "../shared/SearchBar";
import TweetsContextProvider from "@/context/TweetsContext";
import Widget from "../shared/Widget";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UserCard from "../shared/UserCard";
import Button from "../shared/Button";
import Link from "next/link";

const Layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();

    const users = await prisma.users.findMany({
        take: 3,
        where: {
            Username: {
                not: session?.user?.username
            }
        }
    });

    return (
        <TweetsContextProvider>
            <div className="flex w-full max-w-fit mx-auto">
                <div className="shrink-0 flex w-18 xl:w-65">
                    <LeftSideBar />
                </div>
                <div className="flex w-full min-w-0 gap-8">
                    <div className="min-w-0 w-full md:w-[598px] h-screen border-r border-l border-gray-200 overflow-y-auto no-scrollbar">
                        {children}
                    </div>
                    <div className="hidden lg:flex flex-col gap-4 flex-shrink-0">
                        <SearchBar />
                        <Widget title="Who to follow">
                            {users.map((user) => {
                                return (
                                    <Link key={user.Username} href={user.Username}>
                                        <div className="mt-2 hover:bg-gray-100 hover:cursor-pointer w-full p-2">
                                            <UserCard 
                                                image={user.ProfilePicture}
                                                username={user.Username}
                                                displayName={user.DisplayName}
                                            >
                                                <div className="pl-15">
                                                    <Button variant="black" hoverColor="white" style="text-sm px-4 pt-2 pb-2">Follow</Button>
                                                </div>
                                            </UserCard>
                                        </div>
                                    </Link>
                                );
                            })}
                        </Widget>
                    </div>
                </div>
            </div>  
        </TweetsContextProvider>
    );
}

export default Layout;