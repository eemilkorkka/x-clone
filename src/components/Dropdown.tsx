import { ChangeEvent } from "react";

interface DropdownProps {
    name: string;
    data: string[];
    label: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    style?: string;
}

const Dropdown = ({ name, data, label, onChange, style }: DropdownProps) => {
    return (
        <div className="relative group hover:cursor-pointer">
            <select 
                className="w-full p-2.5 pt-5 border border-gray outline-none appearance-none rounded-md group-focus-within:border-xblue" 
                name={name} 
                onChange={(e) => onChange(e)}>
                    <option></option>
                    {data.map((item, index) => {
                        return (
                            <option key={index}>{item}</option>
                        );
                    })}
            </select>
            <label className="absolute text-gray-400 top-1 left-3 text-[0.8em] group-focus-within:text-xblue">
                {label}
            </label>
        </div>
    );
}

export default Dropdown;