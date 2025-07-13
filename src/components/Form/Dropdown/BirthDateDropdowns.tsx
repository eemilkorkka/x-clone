import { ChangeEvent } from "react";
import { dropdownFields } from "@/utils/birthDateDropdowns";
import Dropdown from "./Dropdown";
import formDataType from "@/types/formDataType";

interface BirthDateDropdownsProps {
    formData: formDataType;
    bgColor?: "bg-white" | "bg-black";
    borderColor?: "border-gray" | "border-gray-300";
    style?: string;
    onChange: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BirthDateDropdowns = ({ formData, bgColor = "bg-black", borderColor = "border-gray", style, onChange }: BirthDateDropdownsProps) => {
    return (
        <div className={`flex gap-2 ${style}`}>
            {dropdownFields.map((dropdownField, index) => {
                return (
                    <div key={index} className={dropdownField.style}>
                        <Dropdown
                            name={dropdownField.name}
                            data={dropdownField.data}
                            label={dropdownField.label}
                            value={formData[dropdownField.name]}
                            formData={formData}
                            bgColor={bgColor}
                            borderColor={borderColor}
                            onChange={onChange}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default BirthDateDropdowns;