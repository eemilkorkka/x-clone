"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { User } from "@/components/User/User";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Button } from "../ui/button";
import { UserBase } from "@/types/User";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface LogoutPopoverProps {
    children: React.ReactNode;
    user: UserBase;
}

export const LogoutPopover = ({ children, user }: LogoutPopoverProps) => {
    
    const router = useRouter();

    const onLogOutClick = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                }
            }
        });
    }
    
    return (
        <Popover>
            <PopoverTrigger render={
                <button className="w-full" >
                    {children}
                </button>
            }>

            </PopoverTrigger>
            <PopoverContent className="hidden mobile:flex rounded-lg p-0 overflow-hidden pt-4 ring-0 border-none drop-shadow-md">
                <User user={user} useLink={false} styles="hidden mobile:flex p-2.5 hover:bg-inherit pb-2" contentStyles="block">
                    <IoIosCheckmarkCircle size={18} className="text-emerald-500" />
                </User>
                <div className="w-full h-1 border-t border-border"></div>
                <Button variant="ghost" className="text-base rounded-none font-bold justify-start py-6 hover:cursor-pointer " onClick={onLogOutClick}>Log out @{user.username ?? ""}</Button>
            </PopoverContent>
        </Popover>
    )
}