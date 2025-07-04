"use client";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import ProfilePicture from "@/components/Profile/ProfilePicture";
import { User } from "@/types/userType";
import { mobileSideBarOptions } from "@/utils/sidebarOptions";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ReactNode, useState } from "react";
import SideBarOption from "../LeftSideBar/SidebarOption";
import { IoLogInOutline } from "react-icons/io5";
import LogoutDialog from "./LogoutDialog/LogoutDialog";

interface LeftSideBarMobileProps {
    children: ReactNode;
    user: User;
}

const LeftSideBarMobile = ({ children, user }: LeftSideBarMobileProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-20" />
            <Dialog.Content className="fixed left-0 top-0 h-screen w-70 bg-white z-20 focus:outline-none">
                <VisuallyHidden.Root>
                    <Dialog.Title />
                </VisuallyHidden.Root>
                <div className="flex flex-col gap-1.5 p-4">
                    <ProfilePicture image={user.ProfilePicture} href={`/${user.Username}`} />
                    <ProfileInfo
                        displayName={user.DisplayName}
                        username={user.Username}
                        followers={user.followers}
                        following={user.following}
                    />
                </div>
                {mobileSideBarOptions(user.Username).map((option, index) => {
                    return (
                        <SideBarOption
                            key={index}
                            text={option.text}
                            href={option.href}
                            lightIcon={option.lightIcon}
                            isMobileSideBar={true}
                            style="w-full justify-start p-4 rounded-none"
                        />
                    )
                })}
                <LogoutDialog>
                    <button className="flex gap-5 p-4 hover:bg-gray-200 hover:cursor-pointer w-full text-xl font-bold">
                        <IoLogInOutline size={25} />
                        <span>Log out</span>
                    </button>
                </LogoutDialog>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default LeftSideBarMobile;