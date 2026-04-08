"use client";

import { TwoFactorAuth } from "@/components/auth/2FA";
import { DialogHeader } from "@/components/auth/Forms/DialogHeader";
import { FormButton } from "@/components/auth/Forms/SignUpForm/FormButton";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import { usePathname, useRouter } from "next/navigation";

export default function SignupModal() {
    const router = useRouter(); 
    const pathname = usePathname();

    return pathname === "/two_factor_authentication" && (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="flex flex-col !max-w-[600px] h-full min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5 ring-0" showCloseButton={false}>
                <DialogHeader handleDialogClose={() => router.back()} />
                <div className="flex flex-1 flex-col mx-auto max-w-md w-full mt-2">
                    <div className="space-y-2">
                        <DialogTitle className="text-3xl font-bold">Two-factor Authentication</DialogTitle>
                    </div>
                    <TwoFactorAuth styles="justify-between mt-6">
                        <FormButton title="Continue" />
                    </TwoFactorAuth>
                </div>
            </DialogContent>
        </Dialog>
    )
}