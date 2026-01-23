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
import { Button } from "../ui/button";
import { IoPersonRemove } from "react-icons/io5";

interface RemoveFollowerDialogProps {
    username: string;
    onConfirmClick: () => void;
}

export const RemoveFollowerDialog = ({ username, onConfirmClick }: RemoveFollowerDialogProps) => {

    const [open, setOpen] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button variant="ghost" className={"w-full rounded-none justify-start font-bold py-5.5 hover:cursor-pointer"}>
                    <IoPersonRemove />
                    Remove this follower
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="!max-w-xs ring-0">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Remove this follower</AlertDialogTitle>
                    <AlertDialogDescription>
                        @{username} will be removed from your followers and won’t be notified by X. They can follow you again in the future.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex !flex-col !justify-center space-y-1">
                    <AlertDialogAction className="bg-destructive rounded-full py-5 font-bold hover:cursor-pointer hover:bg-destructive hover:brightness-[95%]" onClick={onConfirmClick}>Remove</AlertDialogAction>
                    <AlertDialogCancel className="rounded-full py-5 font-bold hover:cursor-pointer" onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}