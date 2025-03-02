import formDataType from "@/types/formDataType";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

interface MonthDropdownProps {
    formData: formDataType;
    setFormData: Dispatch<SetStateAction<formDataType>>;
    setMonthDropdownVisible: Dispatch<SetStateAction<boolean>>;
}

const MonthDropdown = ({ formData, setFormData, setMonthDropdownVisible }: MonthDropdownProps) => {

    const months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ];

    const handleMonthClick = (month: string) => {
        setMonthDropdownVisible(false);
        setFormData((prevFormData) => ({
            ...prevFormData,
            birthDateMonth: month
        }));
    }

    return (
        <div className="flex flex-col top-30 absolute w-[200px] items-start bg-black border border-gray z-10 rounded-lg">
            {months.map((month) => {
                return (
                    <button 
                        key={month}
                        type="button"
                        className="w-full px-2 text-left hover:bg-blue-300 hover:text-gray" 
                        onClick={() => handleMonthClick(month)}
                    >{month}
                    </button>
                );
            })}
        </div>
    );
}

export default MonthDropdown;