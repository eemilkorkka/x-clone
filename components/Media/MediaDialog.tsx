import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface MediaDialogProps {
    children: React.ReactNode;
    src: string;
    styles?: string;
}
export const MediaDialog = ({ children, src, styles }: MediaDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={cn("w-full h-full", styles)} onClick={(e) => e.stopPropagation()}>
                {children}
            </DialogTrigger>
            <DialogOverlay className="bg-black/60" />
            <DialogContent className="max-h-[90vh] max-w-[90vw] h-[90vh] w-[90vw] p-0 rounded-none ring-0 bg-transparent" showCloseButton={false}>
                <Image
                    src={src}
                    fill
                    alt="Media"
                    className="object-contain"
                />
            </DialogContent>
        </Dialog>
    )
}