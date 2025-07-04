"use client";
import { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface FeedHeaderProps {
    title?: string;
    children?: ReactNode;
}

const FeedHeader = ({ title, children }: FeedHeaderProps) => {
    const router = useRouter();
    
    return (
        <div className="flex gap-7 ps-4 items-center pt-2 pb-2 sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
            <Button variant="outline" style="rounded-full border-0 h-fit p-2 hover:bg-gray-200 hover:cursor-pointer" onClick={() => router.back()}>
                <FaArrowLeft size={18} className="text-gray-700" />
            </Button>
            <>
                {children ? (
                    children
                ) : (
                    <span className="font-bold text-xl">{title}</span>
                )}
            </>
        </div>
    );
}

export default FeedHeader;