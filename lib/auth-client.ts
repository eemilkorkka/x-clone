import { twoFactorClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [
        twoFactorClient(),
        usernameClient(),
        inferAdditionalFields<typeof auth>(),
    ]
})