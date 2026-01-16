import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "../ui/dialog";

interface MediaDialogProps {
    children: React.ReactNode;
    src: string;
}
export const MediaDialog = ({ children, src }: MediaDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-fit h-fit" onClick={(e) => e.stopPropagation()}>
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