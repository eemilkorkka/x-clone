"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface UnfollowDialogProps {
    children: React.ReactNode;
    username: string;
    onConfirmClick: () => void;
    styles?: string;
}

export const UnfollowDialog = ({ children, username, onConfirmClick, styles }: UnfollowDialogProps) => {
    const [open, setOpen] = useState(false);

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConfirmClick();
        setOpen(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger nativeButton={false} render={
                <div className={styles}>
                    {children}
                </div>
            }>
            </AlertDialogTrigger>
            <AlertDialogContent className="!max-w-xs ring-0">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Unfollow @{username}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Their posts will no longer show up in your Following timeline.
                        You can still view their profile, unless their posts are protected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex !flex-col !justify-center space-y-1">
                    <AlertDialogAction className="rounded-full py-5 font-bold hover:cursor-pointer" onClick={handleConfirm}>Unfollow</AlertDialogAction>
                    <AlertDialogCancel className="rounded-full py-5 font-bold hover:cursor-pointer" onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}