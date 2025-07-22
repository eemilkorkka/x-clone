import { ReactNode } from "react";
import { GoHomeFill, GoHome } from "react-icons/go";
import { IoSearchOutline, IoPerson, IoPersonOutline, IoBookmark, IoBookmarkOutline, IoSettingsOutline} from "react-icons/io5";
import { HiOutlineBell, HiOutlineEnvelope } from "react-icons/hi2";
import { BsPeople,  BsTwitterX } from "react-icons/bs";
import { RiFileList2Line } from "react-icons/ri";

export interface Option {
    text: string;
    href?: string;
    darkIcon?: ReactNode;
    lightIcon: ReactNode; 
    style?: string; 
}

export const sideBarOptions = (username: string): Option[] => [
    {
        text: "Home",
        href: "/home",
        darkIcon: <GoHomeFill size={30} />,
        lightIcon: <GoHome size={30} />
    },
    {
        text: "Explore",
        lightIcon: <IoSearchOutline size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        text: "Notifications",
        lightIcon: <HiOutlineBell size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        text: "Messages",
        lightIcon: <HiOutlineEnvelope size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        text: "Bookmarks",
        href: "/bookmarks",
        darkIcon: <IoBookmark size={30} />,
        lightIcon: <IoBookmarkOutline size={30} />,
    },
    {
        text: "Communities",
        href: "/communities",
        lightIcon: <BsPeople size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        text: "Profile",
        href: "/" + username,
        darkIcon: <IoPerson size={30} />,
        lightIcon: <IoPersonOutline size={30} />
    }
];

export const mobileSideBarOptions = (username: string) => [
    {
        text: "Profile",
        href: "/" + username,
        lightIcon: <IoPersonOutline size={25} />
    },
    {
        text: "Premium",
        lightIcon: <BsTwitterX size={25} />
    },
    {
        text: "Communities",
        lightIcon: <BsPeople size={25} />,
    },
    {
        text: "Lists",
        lightIcon: <RiFileList2Line size={25} />
    },
    {
        text: "Bookmarks",
        href: "/bookmarks",
        lightIcon: <IoBookmarkOutline size={25} />
    },
    {
        text: "Settings and privacy",
        href: "/settings",
        lightIcon: <IoSettingsOutline size={25} />
    }
];

export const mobileBottomNavigationOptions = [
    {
        href: "/home",
        darkIcon: <GoHomeFill size={30} />,
        lightIcon: <GoHome size={30} />
    },
    {
        lightIcon: <IoSearchOutline size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        lightIcon: <HiOutlineBell size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        lightIcon: <HiOutlineEnvelope size={30} />,
        style: "hover:cursor-not-allowed!",
    },
    {
        lightIcon: <BsPeople size={30} />,
        style: "hover:cursor-not-allowed!",
    }
];