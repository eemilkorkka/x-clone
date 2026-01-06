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
import { Button } from "@/components/ui/button";
import React from "react";

interface DeleteTweetDialogProps {
    children: React.ReactNode;
    onConfirmClick: () => void;
}

export const DeleteTweetDialog = ({ children, onConfirmClick }: DeleteTweetDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger nativeButton={false} onClick={(e) => e.stopPropagation()} render={
                <div className="w-full">
                    {children}
                </div>
            }>
            </AlertDialogTrigger>
            <AlertDialogContent className="!max-w-xs">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Delete post?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This can’t be undone and it will be removed from your profile,
                        the timeline of any accounts that follow you, and from search results.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex !flex-col !justify-center">
                    <Button className="bg-destructive rounded-full py-5 font-bold hover:cursor-pointer hover:bg-destructive hover:brightness-[95%]" onClick={(e) => { e.stopPropagation(); onConfirmClick(); }}>Delete</Button>
                    <AlertDialogCancel className="rounded-full py-5 font-bold hover:cursor-pointer" onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}