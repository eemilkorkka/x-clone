import { useColor } from "@/context/ColorContext";
import { colorsArray } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ControllerFieldState } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";

interface CustomSelectProps {
    label: string;
    value: string | number | undefined;
    fieldState?: ControllerFieldState;
    options: string[];
    styles?: string;
}

export const CustomSelect = ({ label, value, fieldState, options, styles, ...field }: CustomSelectProps) => {
    
    const { colors } = useColor();
    const pathname = usePathname();

    const useChosenColor = pathname !== "/" && pathname !== "/signup";
    const borderFocusColor = useChosenColor ? colors.focusVisibleBorderColor : colorsArray[0].focusVisibleBorderColor;
    const textFocusColor = useChosenColor ? colors.peerFocusTextColor : colorsArray[0].peerFocusTextColor;
    
    return (
        <div className="relative">
            <select {...field} value={value} className={cn(`peer appearance-none outline-none px-2 w-full border border-zinc-800 rounded-sm py-4`, borderFocusColor, styles)}>
                <option value="" className="bg-black"></option>
                {options.map((option, index) => (
                    <option key={index} value={option} className="bg-black text-white">{option}</option>
                ))}
            </select>
            <label className={`absolute text-sm top-1 left-2 text-zinc-500 ${textFocusColor}`}>{label}</label>
            <IoIosArrowDown size={25} className={`absolute text-sm top-1/2 -translate-y-1/2 right-2 text-zinc-500 ${textFocusColor}`} />
        </div>
    )
}