import { BsBell, BsPeople } from "react-icons/bs";
import { FaXTwitter, FaFeatherPointed } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoBookmark, IoBookmarkOutline, IoPerson, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { Navitem } from "@/components/Leftsidebar/Navitem";
import { User } from "@/components/User/User";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { BsThreeDots } from "react-icons/bs";
import { LogoutPopover } from "./LogoutPopover";
import { SettingsNavItem } from "./SettingsNavItem";

export interface Option {
    text: string;
    href?: string;
    activeIcon?: React.ReactNode;
    icon: React.ReactNode;
    style?: string;
}

export const Leftsidebar = async () => {

    const session = await getSession();

    return (
        <nav className="w-full flex flex-col justify-between items-center xl:items-start mobile:pt-2 mobile:pb-4 px-2 mobile:h-screen fixed bottom-0 mobile:sticky mobile:top-0 bg-background z-20">

            <div className="w-full">
                <div className="hidden mobile:block p-2.5 mx-1 hover:bg-ring/20 rounded-full w-fit">
                    <Link href="/home">
                        <FaXTwitter size={30} />
                    </Link>
                </div>

                {session && (
                    <div className="flex flex-row p-2 mobile:p-0 mobile:flex-col justify-between items-center xl:items-start mobile:space-y-2">
                        <Navitem
                            href="/home"
                            icon={<GoHome size={30} />}
                            activeIcon={<GoHomeFill size={30} />}
                            label="Home"
                        />

                        <Navitem
                            icon={<IoSearchOutline size={30} />}
                            label="Explore"
                        />

                        <Navitem
                            icon={<BsBell size={30} />}
                            label="Notifications"
                            styles="hidden mobile:flex"
                        />

                        <Navitem
                            icon={<HiOutlineEnvelope size={30} />}
                            label="Messages"
                            styles="hidden mobile:flex"
                        />

                        <Navitem
                            href="/bookmarks"
                            icon={<IoBookmarkOutline size={30} />}
                            activeIcon={<IoBookmark size={30} />}
                            label="Bookmarks"
                        />

                        <Navitem
                            icon={<BsPeople size={30} />}
                            label="Lists"
                            styles="hidden mobile:flex"
                        />

                        <Navitem
                            href={`/${session?.user.username}`}
                            icon={<IoPersonOutline size={30} />}
                            activeIcon={<IoPerson size={30} />}
                            label="Profile"
                        />

                        <SettingsNavItem />

                        <Link href="/compose/post" className="hidden mobile:inline">
                            <Button className="w-12 h-12 xl:w-60 rounded-full xl:h-13 font-bold hover:cursor-pointer text-lg">
                                <div className="hidden xl:inline">Post</div>
                                <div className="inline xl:hidden">
                                    <FaFeatherPointed className="size-6" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {session && (
                <LogoutPopover user={session.user}>
                    <User user={session.user} useLink={false} styles="hidden mobile:flex rounded-full p-2.5 w-15 h-15 xl:w-full" contentStyles="hidden xl:block">
                        <BsThreeDots className="hidden xl:inline" />
                    </User>
                </LogoutPopover>
            )}
        </nav>
    )
}