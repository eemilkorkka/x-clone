import ProfilePicture from "@/components/Profile/ProfilePicture";
import Button from "@/components/Button/Button";
import { BsTwitterX } from "react-icons/bs";
import { useSession } from "next-auth/react";
import LeftSideBarMobile from "../LeftSideBarMobile/LeftSideBarMobile";
import { User } from "@/types/User";

interface MobileHeaderProps {
    user: User;
}

const MobileHeader = ({ user }: MobileHeaderProps) => {

    const { data } = useSession();

    return (
        <>
            <div className="flex items-center w-full px-4 mobile:hidden">
                <div className="w-2/3">
                    <LeftSideBarMobile user={user}>
                        <div className="w-[35px] h-[35px]">
                            <ProfilePicture image={data?.user.image} />
                        </div>
                    </LeftSideBarMobile>
                </div>
                <BsTwitterX size="55" className="p-2.5" />
                <div className="w-2/3 flex justify-end">
                    <Button
                        variant="outline"
                        textColor="black"
                        styles="px-4 text-sm p-2!"
                        hoverColor="gray"
                    >
                        Get Premium
                    </Button>
                </div>
            </div>
        </>
    );
}

export default MobileHeader;