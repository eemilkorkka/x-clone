"use client";
import { Popover } from "radix-ui"
import { ReactNode, useState } from "react"
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import Link from "next/link";
import DisplayDialog from "../DisplayDialog/DisplayDialog";

interface MorePopoverProps {
    children: ReactNode
}

const MorePopover = ({ children }: MorePopoverProps) => {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                {children}
            </Popover.Trigger>
            <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content align="start" side="top" className="z-20 flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg bg-white border-gray-200 overflow-hidden">
                    <Link href="/settings" className="flex items-center gap-4 p-4 hover:bg-gray-100/50 font-bold text-lg">
                        <IoSettingsOutline size={23} /> Settings and privacy
                    </Link>
                    <DisplayDialog>
                        <button className="flex items-center gap-4 p-4 hover:cursor-pointer hover:bg-gray-100/50 font-bold text-lg">
                            <HiOutlinePaintBrush size={23} /> Display
                        </button>
                    </DisplayDialog>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}

export default MorePopover