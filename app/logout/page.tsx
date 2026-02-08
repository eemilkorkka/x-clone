import { LogoutDialog } from "@/components/Leftsidebar/LogoutDialog";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LogoutPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return <LogoutDialog />
}