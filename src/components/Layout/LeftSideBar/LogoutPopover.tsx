"use client"
import UserCard from "@/components/shared/UserCard";
import { Popover } from "radix-ui";
import { ReactNode } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { signOut } from "next-auth/react";

interface LogoutPopover {
    children: ReactNode;
    image: string;
    username: string;
    displayName: string;
}

const LogoutPopover = ({ image, username, displayName, children }: LogoutPopover) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {children}
            </Popover.Trigger>
		    <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content side="top" sideOffset={65} align="center" className="w-[270px] flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl">
                    <div className="p-3">
                        <UserCard image={image} username={username} displayName={displayName}>
                            <IoIosCheckmarkCircle fill="rgb(0, 186, 124)" size={20} />
                        </UserCard>
                    </div>
                    <button className="text-left p-3 font-bold hover:bg-gray-100 hover:cursor-pointer" onClick={() => signOut()}>Log out @{username}</button>
                    <Popover.Arrow fill="white" />
                </Popover.Content>
            </Popover.Portal>
	    </Popover.Root>
    );
}

export default LogoutPopover;