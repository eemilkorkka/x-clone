import { ControllerFieldState } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";

interface CustomSelectProps {
    label: string;
    value: string | number | undefined;
    fieldState?: ControllerFieldState;
    options: string[];
}

export const CustomSelect = ({ label, value, fieldState, options, ...field }: CustomSelectProps) => {
    return (
        <div className="relative">
            <select {...field} value={value} className="peer appearance-none focus:border-sky-500 outline-none pt-6.5 px-2 w-full border border-zinc-800 rounded-sm py-4">
                <option value="" className="bg-black"></option>
                {options.map((option, index) => (
                    <option key={index} value={option} className="bg-black text-white">{option}</option>
                ))}
            </select>
            <label className="absolute text-sm top-2 left-2 text-zinc-500 peer-focus-within:text-sky-500">{label}</label>
            <IoIosArrowDown size={25} className="absolute text-sm top-1/2 -translate-y-1/2 right-2 text-zinc-500 peer-focus-within:text-sky-500" />
        </div>
    )
}