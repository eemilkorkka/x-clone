"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export const ReturnBack = () => {

    const router = useRouter();

    return (
        <Button size="icon-lg" variant="ghost" className="rounded-full hover:cursor-pointer hover:bg-black/10" onClick={() => router.back()}>
            <FaArrowLeft />
        </Button>
    )
}