import SideBarOption from "./SidebarOption";
import { sideBarOptions, mobileBottomNavigationOptions } from "@/utils/sidebarOptions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import UserCard from "@/components/Shared/UserCard";
import { BsThreeDots } from "react-icons/bs";
import LogoutPopover from "./LogoutPopover";
import PostButtonDialog from "./PostButtonDialog";
import { FaFeatherPointed } from "react-icons/fa6";
import { CiCircleMore } from "react-icons/ci";
import MorePopover from "./MorePopover/MorePopover";

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
        <div className="fixed border-t-1 border-gray-200 mobile:border-t-0 mobile:static bg-white bottom-0 left-0 z-20 w-full mobile:w-full h-16 mobile:h-screen flex mobile:flex-col items-center justify-between">
            <div className="mobile:fixed z-10 flex mobile:flex-col mobile:pt-1 gap-4 justify-between w-full mobile:w-auto xl:w-61">
                <Link href="/home" className="hidden mobile:inline">
                    <button className="hover:bg-gray-200 p-2.5 hover:cursor-pointer rounded-full">
                        <BsTwitterX size="30" className="p-0.5" />
                    </button>
                </Link>
                <div className="hidden items-center mobile:items-start mobile:flex flex-col gap-4 w-full">
                    {sideBarOptions(user?.Username ?? "").map((option, index) => (
                        <SideBarOption
                            key={index}
                            text={option.text}
                            href={option.href}
                            darkIcon={option.darkIcon}
                            lightIcon={option.lightIcon}
                            style={option.style}
                        />
                    ))}
                    <MorePopover>
                        <div>
                            <SideBarOption
                                text={"More"}
                                lightIcon={<CiCircleMore size={30} />}
                                style={"font-normal"}
                            />
                        </div>
                    </MorePopover>
                </div>
                {/* Mobile bottom navigation */}
                <div className="flex justify-around items-center mobile:hidden flex-row w-full">
                    {mobileBottomNavigationOptions.map((option, index) => (
                        <SideBarOption
                            key={index}
                            href={option.href}
                            darkIcon={option.darkIcon}
                            lightIcon={option.lightIcon}
                            style={option.style}
                        />
                    ))}
                </div>
                <PostButtonDialog>
                    <Button variant="black" styles="hidden mobile:inline h-12 w-12 xl:h-13 xl:w-[92%]">
                        <span className="hidden xl:inline">Post</span>
                        <span className="xl:hidden flex justify-center">
                            <FaFeatherPointed size={22} />
                        </span>
                    </Button>
                </PostButtonDialog>
            </div>
            <div className="mb-4 fixed bottom-0 xl:w-61 hidden mobile:inline">
                <LogoutPopover image={user?.ProfilePicture ?? ""} username={user?.Username ?? ""} displayName={user?.DisplayName ?? ""} >
                    <button className="flex w-full p-2.5 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                        <UserCard
                            username={user?.Username ?? ""}
                            displayName={user?.DisplayName ?? ""}
                            showUnderlineOnDisplayname={false}
                            isLogOutButton={true}
                            image={user?.ProfilePicture ?? ""}
                            style="hidden"
                        >
                            <BsThreeDots className="hidden xl:inline" />
                        </UserCard>
                    </button>
                </LogoutPopover>
            </div>
        </div>
    );
}

export default LeftSideBar;