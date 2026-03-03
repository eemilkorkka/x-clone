"use client";

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export const GoogleSignup = ({ styles }: { styles?: string }) => {

    const signup = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/home",
        });
    }

    return (
        <Button size="lg" className={cn("bg-white text-black hover:bg-zinc-200 rounded-full w-full py-5.5 hover:cursor-pointer", styles)} onClick={signup}>
            <div className="flex items-center gap-3">
                <FcGoogle className="" size={25} />
                <span>Sign up with Google</span>
            </div>
        </Button>
    )
}