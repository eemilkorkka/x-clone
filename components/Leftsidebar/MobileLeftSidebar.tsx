"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";

import { CustomAvatar } from "../User/CustomAvatar";
import { authClient } from "@/lib/auth-client";
import { useGetUserData } from "@/hooks/useGetUserData";
import Link from "next/link";
import { IoBookmarkOutline, IoLogInOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { Username } from "../User/Username";
import { Displayname } from "../User/Displayname";
import { LogoutDialog } from "./LogoutDialog";

export const MobileLeftSidebar = () => {

    const { data } = authClient.useSession();
    const { data: userData } = useGetUserData(data?.user.username ?? "");

    return userData && (
        <Sheet>
            <SheetTrigger>
                <CustomAvatar
                    src={data?.user.image ?? ""}
                    alt={``} size="sm"
                    useLink={false}
                    styles="mx-4 mt-3 mb-1"
                />
            </SheetTrigger>
            <SheetContent side="left" className="!w-[65%] !min-w-[315px]" showCloseButton={false}>
                <SheetHeader className="pb-0">
                    <CustomAvatar
                        src={data?.user.image ?? ""}
                        size="md"
                        alt={`@${data?.user.username}`}
                        username={data?.user.username ?? ""}
                        styles="mr-4"
                    />
                    <div>
                        <Displayname
                            username={data?.user.username ?? ""}
                            displayName={data?.user.displayUsername ?? ""}
                            isVerified={data?.user.isVerified ?? false}
                            styles="text-lg"
                        />
                        <Username
                            username={data?.user.username ?? ""}
                        />
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href={`/${userData.username}/following`} className="hover:underline">
                            <span className="font-semibold">
                                {userData.following.length}
                                {' '}
                                <span className="text-zinc-500 font-normal">Following</span>
                            </span>
                        </Link>
                        <Link href={`/${userData.username}/followers`} className="hover:underline">
                            <span className="font-semibold">
                                {userData.followers.length}
                                {' '}
                                <span className="text-zinc-500 font-normal">{userData.followers.length === 1 ? "Follower" : "Followers"}</span>
                            </span>
                        </Link>
                    </div>
                </SheetHeader>
                <Link href={`/${data?.user.username}`} className="flex items-center gap-4 px-4 py-2">
                    <IoPersonOutline size={25} />
                    <span className="text-xl font-bold">Profile</span>
                </Link>
                <Link href="/bookmarks" className="flex items-center gap-4 px-4 py-2">
                    <IoBookmarkOutline size={25} />
                    <span className="text-xl font-bold">Bookmarks</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-4 px-4 py-2">
                    <IoSettingsOutline size={25} />
                    <span className="text-xl font-bold">Settings and privacy</span>
                </Link>
                <Link href="/logout" className="flex items-center gap-4 px-4 py-2">
                    <IoLogInOutline size={25} />
                    <span className="text-xl font-bold">Log out</span>
                </Link>
            </SheetContent>
        </Sheet>
    )
}