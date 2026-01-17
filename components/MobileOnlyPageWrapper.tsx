"use client";

import useWindowWidth from "@/hooks/useWindowWidth";
import { useRouter } from "next/navigation";

interface MobileOnlyPageWrapperProps {
    children: React.ReactNode;
    redirectUrl: string;
}

export const MobileOnlyPageWrapper = ({ children, redirectUrl }: MobileOnlyPageWrapperProps) => {
    
    const width = useWindowWidth();
    const router = useRouter();

    if (width >= 1024) {
        router.push(redirectUrl);
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}