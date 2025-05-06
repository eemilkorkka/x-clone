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
import PostButtonDialog from "./PostButtonDialog";

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
        <div className="w-full flex flex-col mt-2 pr-2 pl-2 justify-between">
            <div className="flex flex-col gap-4">
                <Link href="/home">
                    <button className="hover:bg-gray-200 p-2.5 pl-3 hover:cursor-pointer rounded-full">
                        <BsTwitterX size="30" className="p-0.5" />
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
                <PostButtonDialog>
                    <Button variant="black" style="p-3.5 xl:w-[90%] mt-2">Post</Button>
                </PostButtonDialog>
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