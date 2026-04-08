import { ChangeUsernamePage } from "@/components/Settings/Account/Account_Information/ChangeUsernamePage";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Username",
}

export default async function UsernameSettingsPage() {
    
    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return <ChangeUsernamePage />;
}