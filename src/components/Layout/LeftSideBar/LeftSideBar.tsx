import SideBarOption from "./SidebarOption";
import { sideBarOptions } from "@/utils/sidebarOptions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Button from "@/components/Shared/Button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import UserCard from "@/components/Shared/UserCard";
import { BsThreeDots } from "react-icons/bs";
import LogoutPopover from "./LogoutPopover";
import PostButtonDialog from "./PostButtonDialog";
import { FaFeatherPointed } from "react-icons/fa6";

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
        <div className="fixed mobile:static bg-white bottom-0 left-0 z-20 w-full mobile:w-full h-16 mobile:h-screen flex mobile:flex-col justify-between">
            <div className="flex mobile:flex-col gap-4">
                <Link href="/home" className="pl-1 xl:pl-0 hidden mobile:inline">
                    <button className="hover:bg-gray-200 p-2.5 hover:cursor-pointer rounded-full">
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
                    <Button variant="black" style="h-14 xl:w-[90%] mt-2">
                        <span className="hidden xl:inline">Post</span>
                        <span className="xl:hidden flex justify-center">
                            <FaFeatherPointed size={22} />
                        </span>
                    </Button>
                </PostButtonDialog>
            </div>
            <div className="mb-4 hidden mobile:inline">
                <LogoutPopover image={user?.ProfilePicture ?? ""} username={user?.Username!} displayName={user?.DisplayName!} >
                    <button className="flex w-full p-2.5 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                        <UserCard username={user?.Username!} displayName={user?.DisplayName!} image={user?.ProfilePicture ?? ""} style="hidden" >
                            <BsThreeDots className="hidden xl:inline" />
                        </UserCard>
                    </button>
                </LogoutPopover>
            </div>
        </div>
    );
}

export default LeftSideBar;