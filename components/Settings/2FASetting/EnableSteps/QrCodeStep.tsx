import { Button } from "@/components/ui/button";
import { useColor } from "@/context/ColorContext";
import { cn } from "@/lib/utils";
import QrCode from "react-qr-code";

interface QrCodeProps {
    value: string;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const QrCodeStep = ({ value, setStep }: QrCodeProps) => {

    const { colors } = useColor();

    return (
        <>
            <div className="flex items-center justify-center">
                <QrCode value={value} />
            </div>
            <Button 
                className={cn("max-w-fit text-white self-end font-bold rounded-full px-4 mt-4 hover:cursor-pointer", colors.color, colors.hoverColor)}
                onClick={() => setStep(prev => prev + 1)}
            >
                Continue
            </Button>
        </>
    )
}