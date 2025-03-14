import formDataType from "@/types/formDataType";
import { ChangeEvent } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
    name: string;
    data: string[];
    label: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = ({ name, data, label, onChange }: DropdownProps) => {
    return (
        <div className="relative group hover:cursor-pointer">
            <select 
                className="w-full p-2.5 pt-5 border border-gray outline-none appearance-none rounded-md group-focus-within:border-xblue" 
                name={name}
                onChange={(e) => onChange(e)}>
                    <option disabled selected></option>
                    {data.map((item, index) => {
                        return (
                            <option key={index}>{item}</option>
                        );
                    })}
            </select>
            <label className="absolute text-gray-400 top-1 left-3 text-[0.8em] group-focus-within:text-xblue">
                {label}
            </label>
            <IoIosArrowDown className="absolute top-4.5 right-3 group-focus-within:fill-xblue" size={20} fill={"gray"} />
        </div>
    );
}

export default Dropdown;