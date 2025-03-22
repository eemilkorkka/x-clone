import SideBarOption from "./SidebarOption";
import { sideBarOptions } from "@/utils/sidebarOptions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Button from "@/components/shared/Button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";

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
        <div className="w-full flex flex-col gap-4 pr-2 pl-2 mt-2">
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
            <Button variant="black" style="p-3 xl:w-[90%]">Post</Button>
        </div>
    );
}

export default LeftSideBar;