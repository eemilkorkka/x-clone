"use client";

import { Button } from "@/components/ui/button";
import { useToastMessage } from "@/hooks/useToastMessage";
import { authClient } from "@/lib/auth-client";

export const DeactivateAccount = () => {
    
    const { toastMessage } = useToastMessage();

    const deactivateAccount = async () => {
        const { data, error } = await authClient.deleteUser({
            callbackURL: "/"
        });

        if (error) {
            toastMessage(error.message ?? "Internal Server Error", false);
        } else {
            toastMessage("Confirmation email sent.", true);
        }
    }

    return (
        <Button variant="ghost" onClick={deactivateAccount} className="text-destructive hover:text-destructive hover:cursor-pointer hover:bg-destructive/10 w-full mt-4 p-6 rounded-none">Deactivate</Button>
    )
}