"use client";
import { Dialog, VisuallyHidden } from "radix-ui"
import { ReactNode, useContext, useState } from "react"
import { IoClose } from "react-icons/io5";
import Xlogo from "../../../../../public/X.jpg";
import Username from "@/components/Profile/Username";
import ProfilePicture from "@/components/Profile/ProfilePicture";
import DisplayName from "@/components/Profile/DisplayName";
import { IoCheckmark } from "react-icons/io5";
import { DisplayContext } from "@/Context/DisplayContext";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { bgColors, textColors } from "@/utils/colors";

interface DisplayDialogProps {
    children: ReactNode;
}

const DisplayDialog = ({ children }: DisplayDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { selectedIndex, setSelectedIndex } = useContext(DisplayContext)!;

    const selectColor = (index: number) => {
        localStorage.setItem("color", index.toString());
        setSelectedIndex(index);
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-20" />
                <Dialog.Content className="flex flex-col gap-4 p-2 w-full h-full sm:h-fit sm:max-h-[78vh] top-0 sm:w-[600px] bg-white z-20 fixed left-1/2 sm:top-20 -translate-x-1/2 sm:rounded-2xl overflow-hidden">
                    <VisuallyHidden.Root>
                        <Dialog.Title />
                    </VisuallyHidden.Root>
                    <div className="flex gap-4 items-center">
                        <Dialog.Close asChild className="hover:cursor-pointer text-gray-700">
                            <button className="rounded-full p-1.5 hover:bg-gray-200 outline-0" onClick={() => setOpen(false)}>
                                <IoClose size={23} />
                            </button>
                        </Dialog.Close>
                        <span className="font-bold text-xl">Display</span>
                    </div>
                    <div className="flex flex-col gap-4 -m-2">
                        <p className="text-gray-500 text-sm px-4">Manage your color and background. These settings affect all the X accounts on this browser.</p>
                        <div className="flex gap-2 px-4">
                            <ProfilePicture image={Xlogo.src} />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="flex items-center gap-1">
                                        <DisplayName displayName="X" /> 
                                        <RiVerifiedBadgeFill className="text-xblue" size={19} />
                                    </span>
                                    <Username username="X" />
                                    <i className="text-gray-500 text-lg">·</i>
                                    <span className="text-gray-500 text-[15px] whitespace-nowrap">1h</span>
                                </div>
                                <p>At the heart of X are short messages called posts — just like this one — which can include photos, videos, links, text, hashtags, and mentions like <Username username="X" style={textColors[selectedIndex ?? 0].color} /> </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 border-t-1 border-gray-200 p-4">
                            <h1 className="font-bold text-xl">Color</h1>
                            <div className="flex flex-wrap justify-center gap-15">
                                {bgColors.map((color, index) => {
                                    return (
                                        <button key={index} className={`flex items-center justify-center hover:cursor-pointer rounded-full h-10 w-10 ${color.color}`} onClick={() => selectColor(index)}>
                                            {index === selectedIndex && (
                                                <IoCheckmark color="white" size={25} />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default DisplayDialog;