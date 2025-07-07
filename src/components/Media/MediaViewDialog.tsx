import { Dialog, VisuallyHidden } from "radix-ui";
import { ReactNode } from "react";
import Image from "next/image";

interface MediaViewDialogProps {
    children: ReactNode;
    type: string;
    url: string;
}

const MediaViewDialog = ({ children, type, url }: MediaViewDialogProps) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50">
                    <Dialog.Content className="flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
                        <VisuallyHidden.Root>
                            <Dialog.Title />
                        </VisuallyHidden.Root>
                        {type.startsWith("image") ? (
                            <Image
                                className="w-full h-full object-cover"
                                src={url}
                                alt="Uploaded media"
                                unoptimized
                                width={0}
                                height={0}
                            />
                        ) : (
                            <video
                                className="w-full h-full object-cover"
                                src={url}
                                controls
                                autoPlay
                                playsInline
                                muted
                                preload="metadata"
                            />
                        )}
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default MediaViewDialog;