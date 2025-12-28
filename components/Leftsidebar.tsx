import { BsPeople } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineBell } from "react-icons/hi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoBookmark, IoBookmarkOutline, IoPerson, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { Navitem } from "./Navitem";
import { Button } from "./ui/button";
import Link from "next/link";

export interface Option {
    text: string;
    href?: string;
    activeIcon?: React.ReactNode;
    icon: React.ReactNode; 
    style?: string; 
}

export const Leftsidebar = () => {
    return (
        <nav className="w-full flex flex-col items-center xl:items-start py-2 px-2 mobile:h-screen fixed bottom-0 mobile:sticky mobile:top-0 border-t-1 border-gray-200">
            
            <div className="hidden mobile:block p-2.5 mx-1 hover:bg-ring/20 rounded-full">
                <Link href="/home">
                    <FaXTwitter size={30} />
                </Link>
            </div>

            <div className="w-full flex flex-row mobile:flex-col justify-between items-center xl:items-start space-y-2">
                <Navitem 
                    href="/home"
                    icon={<GoHome size={30} />}
                    activeIcon={<GoHomeFill size={30} />}
                    label="Home"
                />
                <Navitem 
                    href="/explore"
                    icon={<IoSearchOutline size={30} />}
                    label="Explore"
                />
                <Navitem 
                    href="/notifications"
                    icon={<HiOutlineBell size={30} />}
                    label="Notifications"
                    styles="hidden mobile:flex"
                />
                <Navitem 
                    href="/messages"
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
                    href="/lists"
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
        </nav>
    )
}