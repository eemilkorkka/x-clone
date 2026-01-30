import { ChangeUsernamePage } from "@/components/Settings/ChangeUsernamePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Username",
}

export default function UsernameSettingsPage() {
    return <ChangeUsernamePage />;  
}