import SideBarOption from "./SidebarOption";
import { sideBarOptions } from "@/utils/sidebarOptions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Button from "@/components/shared/Button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import UserCard from "@/components/shared/UserCard";
import { BsThreeDots } from "react-icons/bs";
import LogoutPopover from "./LogoutPopover";

const LeftSideBar = async () => {
    const session = await auth();

    const user = await prisma.users.findFirst({
        where: {
            Email: session?.user.email
        },
        select: {
            Username: true,
            DisplayName: true,
            ProfilePicture: true,
        }
    });

    return (
        <div className="w-full flex flex-col justify-between mt-2 pr-2 pl-2">
            <div className="flex flex-col gap-6">
                <Link href="/home">
                    <button className="pl-3 hover:bg-gray-200 p-2.5 hover:cursor-pointer rounded-full">
                        <BsTwitterX size="30" />
                    </button>
                </Link>
                {sideBarOptions(user!.Username).map((option, index) => {
                    return (
                        <SideBarOption
                            key={index} 
                            text={option.text}
                            href={option.href}
                            darkIcon={option.darkIcon}
                            lightIcon={option.lightIcon}
                        />
                    );
                })}
                <Button variant="black" style="p-3.5 xl:w-[90%]">Post</Button>
            </div>
            <div className="mb-4">
                <LogoutPopover image={user?.ProfilePicture ?? ""} username={user?.Username!} displayName={user?.DisplayName!} >
                    <button className="flex w-full p-2.5 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                        <UserCard username={user?.Username!} displayName={user?.DisplayName!} image={user?.ProfilePicture ?? ""} style="hidden" >
                            <BsThreeDots className="hidden xl:inline"/>
                         </UserCard>
                    </button>
                </LogoutPopover>
            </div>
        </div>
    );
}

export default LeftSideBar;