"use client";

import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

export const SplashScreen = () => {
    
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);
    
    return show ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-90">
            <FaXTwitter size={80} />
        </div>
    ) : null;
}