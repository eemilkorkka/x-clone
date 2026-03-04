"use client";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

export const SplashScreen = () => {

    const [show, setShow] = useState(true);
    const { setTheme } = useTheme();
    const { data } = authClient.useSession();

    useEffect(() => {
        if (data?.session) {
            setTheme(localStorage.getItem("selectedTheme") || "dark");
        }

        const timer = setTimeout(() => {
            setShow(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [data]);

    return show ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-90">
            <FaXTwitter size={80} />
        </div>
    ) : null;
}