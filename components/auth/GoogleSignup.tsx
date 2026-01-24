"use client";

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { authClient } from "@/lib/auth-client";

export const GoogleSignup = () => {

    const signup = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/home",
        });
    }

    return (
        <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full w-full py-5.5 hover:cursor-pointer" onClick={signup}>
            <div className="flex items-center gap-3">
                <FcGoogle className="" size={25} />
                <span>Sign up with Google</span>
            </div>
        </Button>
    )
}