"use client";

import { DialogHeader } from "@/components/auth/Forms/DialogHeader";
import { ChooseUsername } from "@/components/auth/Forms/SignUpForm/steps/ChooseUsername";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SetupPage() {

    const router = useRouter();
    const [formData, setFormData] = useState({ username: "" });

    return (
        <div className="bg-black min-h-screen flex justify-center items-center">
            <Dialog open={true}>
                <DialogContent className="flex flex-col !max-w-[600px] h-full min-h-[650px] rounded-none sm:h-fit sm:rounded-2xl bg-black text-white p-2.5" showCloseButton={false}>
                    <DialogHeader handleDialogClose={() => router.push("/")} />
                    <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
                        <DialogTitle className="text-3xl font-bold">Choose your username</DialogTitle>
                        <div className="flex-1 flex flex-col space-y-4 mt-8 h-full">
                            <ChooseUsername formData={formData} setFormData={setFormData} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}   