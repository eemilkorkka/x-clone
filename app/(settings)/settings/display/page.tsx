import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { CustomAvatar } from "@/components/User/CustomAvatar";
import { Displayname } from "@/components/User/Displayname";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import xLogo from "@/public/x-logo.jpg";
import { Username } from "@/components/User/Username";
import { Text } from "@/components/Text";
import { ColorSelection } from "@/components/Settings/ColorSelection";

export default function DisplayPage() {
    return (
        <div>
            <FeedHeader styles="px-2 flex gap-6 items-center border-b-0">
                <ReturnBack />
                <h1 className="text-lg font-bold">Display</h1>
            </FeedHeader>
            <div className="px-4 space-y-4">
                <p className="text-zinc-500 mt-4 text-sm">Manage your display color. These settings affect all the X accounts on this browser.</p>
                <div className="flex">
                    <CustomAvatar
                        src={xLogo.src}
                        alt={"X"}
                        size="md"
                        useLink={false}
                    />
                    <div className="ml-2">
                        <div className="flex items-center">
                            <Displayname displayName="X" username="X" useLink={false} />
                            <RiVerifiedBadgeFill className="text-sky-500 ml-1" size={18} />
                            <Username username="X" useLink={false} styles="ml-1 text-zinc-500" />
                            <span className="ml-1 text-zinc-500">·</span>
                            <span className="ml-1 text-zinc-500">10m</span>
                        </div>
                        <Text text="At the heart of X are short messages called posts — just like this one — which can include photos, videos, links, text, hashtags, and mentions like @X" />
                    </div>
                </div>
                <ColorSelection />
            </div>
        </div>
    )
}