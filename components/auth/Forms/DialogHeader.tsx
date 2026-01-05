import { DialogHeader as ShadcnDialogHeader } from "@/components/ui/dialog";
import { SetStateAction } from "react";
import { FaArrowLeft, FaXTwitter } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

interface DialogHeaderProps {
    step: number;
    setStep: React.Dispatch<SetStateAction<number>>;
    handleDialogClose: () => void;
}

export const DialogHeader = ({ step, setStep, handleDialogClose }: DialogHeaderProps) => {
    return (
        <ShadcnDialogHeader className="relative flex flex-row justify-center items-center">
            {step > 0 ? (
                <FaArrowLeft size={23} className="absolute left-0 hover:cursor-pointer" onClick={() => setStep(prev => prev - 1)} />
            ) : (
                <IoMdClose size={23} className="absolute left-0 hover:cursor-pointer" onClick={handleDialogClose} />
            )}
            <FaXTwitter size={35} />
        </ShadcnDialogHeader>
    )
}