
import { ManageTwoFactorAuthPage } from "@/components/Settings/2FASetting/TwoFactorAuthPage";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Two-factor Authentication",
}

export default async function ManageTwoFactorAuthPageWrapper() {

    const session = await getSession();

    if (!session) {
        redirect("/");
    } else if (!session.user.username || !session.user.displayUsername) {
        redirect("/signup/setup");
    }

    return <ManageTwoFactorAuthPage />;
}