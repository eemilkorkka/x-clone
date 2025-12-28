import { BsPeople } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineBell } from "react-icons/hi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoBookmark, IoBookmarkOutline, IoPerson, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { Navitem } from "./Navitem";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "./User";
import { getSession } from "@/lib/session";
import { PiDotsThreeBold } from "react-icons/pi";

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
        <nav className="w-full flex flex-col justify-between items-center xl:items-start pt-2 pb-4 px-2 mobile:h-screen fixed bottom-0 mobile:sticky mobile:top-0 border-t-1 border-gray-200">
            
            <div className="w-full">
                <div className="hidden mobile:block p-2.5 mx-1 hover:bg-ring/20 rounded-full">
                    <Link href="/home">
                        <FaXTwitter size={30} />
                    </Link>
                </div>

                <div className="flex flex-row mobile:flex-col justify-between items-center xl:items-start space-y-2">
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
                        icon={<HiOutlineBell size={30} />}
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
                        href="/profile"
                        icon={<IoPersonOutline size={30} />}
                        activeIcon={<IoPerson size={30} />}
                        label="Profile"
                    />

                    <Button className="hidden mobile:inline w-12 h-12 xl:w-60 rounded-full xl:h-13 font-bold hover:cursor-pointer text-lg">Post</Button>
                </div>
            </div>

            <User user={session?.user} useLink={false} styles="hidden mobile:flex rounded-full" contentStyles="hidden xl:flex">
                <PiDotsThreeBold size={20} className="hidden xl:inline" />
            </User>
        </nav>
    )
}