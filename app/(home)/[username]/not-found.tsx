import { FeedHeader } from "@/components/Feed/FeedHeader";
import { ReturnBack } from "@/components/ReturnBack";
import { Displayname } from "@/components/User/Displayname";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function NotFound() {
    
    const session = await getSession();

    if (!session) {
        redirect("/");
    }
    
    return (
        <div>
            <FeedHeader styles="items-center px-2 gap-6 border-b-0">
                <ReturnBack />
                <Displayname
                    displayName={"Profile"}
                    username={""}
                    useLink={false}
                    styles="text-lg"
                />
            </FeedHeader>
            <div className="max-w-80 mx-auto space-y-2">
                <p className="font-extrabold bold text-3xl mt-24">This account doesn't exist.</p>
                <p className="text-zinc-500">Try searching for another.</p>
            </div>
        </div>
    )
}