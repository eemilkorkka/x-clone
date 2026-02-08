"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const LogoutDialog = () => {

    const { data } = authClient.useSession();
    const router = useRouter();

    const onLogOutClick = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                }
            }
        });
    }
    
    return (
        <AlertDialog open={true}>
            <AlertDialogContent className="!max-w-xs ring-0 z-70">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold mr-auto">Log out of @{data?.user.username ?? ""}?</AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        This will only apply to this account, and you’ll still be logged in to your other accounts.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex !flex-col !justify-center space-y-1">
                    <Button className="rounded-full text-white py-5 font-bold hover:cursor-pointer" onClick={onLogOutClick}>Log out</Button>
                    <AlertDialogCancel className="rounded-full py-5 font-bold hover:cursor-pointer" onClick={() => router.back()}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}