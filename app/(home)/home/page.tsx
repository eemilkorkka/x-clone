import { HomeFeed } from "@/components/HomeFeed";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div className="h-screen">
            <HomeFeed />
        </div>
    )
}
