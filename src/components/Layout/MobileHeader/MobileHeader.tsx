import ProfilePicture from "@/components/Profile/ProfilePicture";
import Button from "@/components/Shared/Button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import LeftSideBarMobile from "../LeftSideBarMobile/LeftSideBarMobile";
import { User } from "@/types/userType";

interface MobileHeaderProps {
    user: User;
}

const MobileHeader = ({ user }: MobileHeaderProps) => {

    const { data } = useSession();
    const pathname = usePathname();

    return (
        <>
            {pathname.split("/")[1] === "home" && (
                <div className="flex items-end w-full px-4 mobile:hidden">
                    <div className="w-2/3">
                        <LeftSideBarMobile user={user}>
                            <div className="w-[35px] h-[35px]">
                                <ProfilePicture image={data?.user.image} />
                            </div>
                        </LeftSideBarMobile>
                    </div>
                    <Link href="/home">
                        <button className="hover:bg-gray-200 p-2.5 hover:cursor-pointer rounded-full">
                            <BsTwitterX size="26" className="p-0.5" />
                        </button>
                    </Link>
                    <div className="w-2/3 flex justify-end">
                        <Button
                            variant="outline"
                            textColor="black"
                            style="px-4 text-sm p-2!"
                            hoverColor="gray"
                        >
                            Get Premium
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default MobileHeader;