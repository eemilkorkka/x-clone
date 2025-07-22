import { Dialog, VisuallyHidden } from "radix-ui";
import { ReactNode, useState } from "react";
import Button from "@/components/Button/Button";
import { BsTwitterX } from "react-icons/bs";
import { signOut } from "next-auth/react";

interface LogoutDialogProps {
    children: ReactNode;
}

const LogoutDialog = ({ children }: LogoutDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-50">
                    <Dialog.Content className="flex flex-col gap-4 w-80 bg-white rounded-2xl p-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <VisuallyHidden.Root>
                            <Dialog.Title />
                        </VisuallyHidden.Root>
                        <div className="flex flex-col gap-4 justify-center">
                            <div className="flex justify-center">
                                <BsTwitterX size={35} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold">Log out of X?</span>
                                <p className="text-gray-500">
                                    You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.
                                </p>
                            </div>
                            <Button variant="black" onClick={() => signOut()}>Log out</Button>
                            <Button
                                variant="outline"
                                textColor="text-gray-800"
                                hoverColor="white"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default LogoutDialog;