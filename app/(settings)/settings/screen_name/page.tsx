import { ChangeUsernamePage } from "@/components/Settings/Account/Account_Information/ChangeUsernamePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Username",
}

export default function UsernameSettingsPage() {
    return <ChangeUsernamePage />;  
}