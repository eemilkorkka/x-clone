"use client";

import useWindowWidth from "@/hooks/useWindowWidth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MobileOnlyPageWrapperProps {
    children: React.ReactNode;
    redirectUrl: string;
}

export const MobileOnlyPageWrapper = ({ children, redirectUrl }: MobileOnlyPageWrapperProps) => {
    
    const width = useWindowWidth();
    const router = useRouter();

    useEffect(() => {
        if (width && width >= 1024) {
            router.push(redirectUrl);
        }
    }, [width, router, redirectUrl]);

    if (width && width >= 1024) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}