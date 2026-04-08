"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export const ReturnBack = ({ styles }: { styles?: string }) => {

    const router = useRouter();

    return (
        <Button size="icon-lg" variant="ghost" className={cn("rounded-full hover:cursor-pointer hover:bg-black/10", styles)} onClick={() => router.back()}>
            <FaArrowLeft />
        </Button>
    )
}