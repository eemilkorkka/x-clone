import { ChangeEmailPage } from "@/components/Settings/Account/Account_Information/ChangeEmailPage";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Email",
}

export default async function EmailPage() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return <ChangeEmailPage />;
}