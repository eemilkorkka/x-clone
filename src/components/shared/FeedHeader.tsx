import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa6";

interface FeedHeaderProps {
    href?: string;
    title?: string;
    children?: ReactNode;
}

const FeedHeader = ({ href, title, children }: FeedHeaderProps) => {
    return (
        <div className="flex gap-7 ps-4 items-center pt-2 pb-2 sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
            <Link className="rounded-full h-fit p-2 hover:bg-gray-200 hover:cursor-pointer" href={href ?? "/home"}>
                <FaArrowLeft size={18} className="text-gray-700" />
            </Link>
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