"use client";
import { borderColors, textColors } from "@/utils/colors";
import { DisplayContext } from "@/Context/DisplayContext";
import Formdata from "@/types/Formdata";
import { usePathname } from "next/navigation";
import { ChangeEvent, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
    name: string;
    data: string[];
    label: string;
    formData: Formdata;
    value?: string;
    bgColor?: "bg-white" | "bg-black";
    borderColor?: "border-gray" | "border-gray-300";
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = ({ 
    name, 
    data, 
    label, 
    formData,
    value, 
    bgColor = "bg-black",
    borderColor = "border-gray", 
    onChange 
}: DropdownProps) => {

    const { selectedIndex } = useContext(DisplayContext)!;
    const pathname = usePathname();

    const isRootPath = pathname === "/";

    return (
        <div className="relative group">
            <select 
                className={`w-full ${bgColor} p-2.5 pt-5 border ${borderColor} outline-none appearance-none rounded-md ${isRootPath ? "group-focus-within:border-xblue" : borderColors[selectedIndex ?? 0].color} hover:cursor-pointer`} 
                name={name}
                value={value}
                onChange={onChange}>
                    <option disabled selected>{formData[name]}</option>
                    {data.map((item, index) => {
                        return (
                            <option key={index}>{item}</option>
                        );
                    })}
            </select>
            <label className={`absolute text-gray-400 top-1 left-3 text-[0.8em] ${isRootPath ? "group-focus-within:text-xblue" : textColors[selectedIndex ?? 0].groupFocusText}`}>
                {label}
            </label>
            <IoIosArrowDown className={`absolute top-4.5 right-3 ${isRootPath ? "group-focus-within:fill-xblue" : textColors[selectedIndex ?? 0].fillColor}`} size={20} fill={"gray"} />
        </div>
    );
}

export default Dropdown;