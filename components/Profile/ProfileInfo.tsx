"use client";

import { Button } from "../ui/button";
import { CustomAvatar } from "../User/CustomAvatar"
import { ProfileBanner } from "./ProfileBanner"

export const ProfileInfo = () => {
    return (
        <div className="flex flex-col">
            <ProfileBanner src="">
                <div className="absolute -bottom-15 z-50 left-4 rounded-full border-white border-4">
                    <CustomAvatar src={""} alt={``} size="xl" />
                </div>
            </ProfileBanner>
            <Button className="rounded-full font-bold w-fit px-4 ml-auto mr-4 mt-2.5 hover:cursor-pointer">Follow</Button>
        </div>
    )
}