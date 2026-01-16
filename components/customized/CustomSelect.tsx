import { cn } from "@/lib/utils";
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
    return (
        <div className="relative">
            <select {...field} value={value} className={cn("peer appearance-none focus:border-sky-500 outline-none px-2 w-full border border-zinc-800 rounded-sm py-4", styles)}>
                <option value="" className="bg-black"></option>
                {options.map((option, index) => (
                    <option key={index} value={option} className="bg-black text-white">{option}</option>
                ))}
            </select>
            <label className="absolute text-sm top-1 left-2 text-zinc-500 peer-focus-within:text-sky-500">{label}</label>
            <IoIosArrowDown size={25} className="absolute text-sm top-1/2 -translate-y-1/2 right-2 text-zinc-500 peer-focus-within:text-sky-500" />
        </div>
    )
}