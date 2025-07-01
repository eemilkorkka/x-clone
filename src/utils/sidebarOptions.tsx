import { GoHomeFill, GoHome } from "react-icons/go";
import { IoSearch, IoSearchOutline, IoPerson, IoPersonOutline, IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { HiBell, HiOutlineBell, HiEnvelope, HiOutlineEnvelope } from "react-icons/hi2";
import { BsPeople, BsPeopleFill } from "react-icons/bs";

export const sideBarOptions = (username: string) => [
    {
        text: "Home",
        href: "/home",
        darkIcon: <GoHomeFill size="30"/>,
        lightIcon: <GoHome size="30" />
    },
    {
        text: "Explore",
        href: "/explore",
        darkIcon: <IoSearch size="30" />,
        lightIcon: <IoSearchOutline size="30" />,
        style: "hover:cursor-not-allowed!",
        disabled: true,
    },
    {
        text: "Notifications",
        href: "/notifications",
        darkIcon: <HiBell size="30" />,
        lightIcon: <HiOutlineBell size="30" />,
        style: "hover:cursor-not-allowed!",
        disabled: true
    },
    {
        text: "Messages",
        href: "/messages",
        darkIcon: <HiEnvelope size="30" />,
        lightIcon: <HiOutlineEnvelope size="30" />,
        style: "hover:cursor-not-allowed!",
        disabled: true
    },
    {
        text: "Bookmarks",
        href: "/bookmarks",
        darkIcon: <IoBookmark size="30" />,
        lightIcon: <IoBookmarkOutline size="30" />
    },
    {
        text: "Communities",
        href: "/communities",
        darkIcon: <BsPeopleFill size="30" />,
        lightIcon: <BsPeople size="30" />,
        style: "hover:cursor-not-allowed!",
        disabled: true
    },
    {
        text: "Profile",
        href: "/" + username,
        darkIcon: <IoPerson size="30" />,
        lightIcon: <IoPersonOutline size="30" />
    }
];