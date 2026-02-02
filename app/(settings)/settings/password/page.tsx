import { ChangePasswordPage } from "@/components/Settings/Account/Account_Information/ChangePasswordPage";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Change your password"
}

export default async function ChangePasswordPageWrapper() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return <ChangePasswordPage />
}