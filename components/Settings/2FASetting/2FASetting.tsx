"use client";

import { SettingsItem } from "@/components/Settings/SettingsItem"
import { authClient } from "@/lib/auth-client";
import { GoShield } from "react-icons/go"

export const TwoFactorAuthSetting = () => {

    const { data } = authClient.useSession();

    const is2FAEnabled = data?.user.twoFactorEnabled;
    const title = is2FAEnabled ? "Manage 2FA" : "Enable 2FA";
    const description = is2FAEnabled
        ? "Manage your two-factor authentication settings."
        : "Secure your account by enabling two-factor authentication.";

    return (
        <SettingsItem
            title={title}
            description={description}
            icon={<GoShield className="text-zinc-500 size-6" />}
            href="/settings/account/two_factor_authentication"
            styles="mt-3 pl-8"
        />
    )
}