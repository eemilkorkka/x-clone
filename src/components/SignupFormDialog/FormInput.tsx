"use client";
import formDataType from "@/types/formDataType";
import { ChangeEvent, HTMLInputTypeAttribute, useEffect, useState } from "react";

interface FormInputProps {
    type: HTMLInputTypeAttribute;
    name: string;
    label: string;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    labelStyle?: string;
    isValid?: boolean;
}

const FormInput = ({ 
    type, 
    name, 
    label, 
    formData, 
    onChange,
    labelStyle, 
    isValid }: FormInputProps) => {

    const [inputEmpty, setInputEmpty] = useState<boolean>(formData[name] === "");
    
    useEffect(() => {
        setInputEmpty(formData[name] === "");
    }, [formData[name]]);

    return (
        <div className="relative group hover:cursor-pointer">
            <input 
                type={type}
                name={name}
                value={formData[name]}
                onChange={onChange}
                className={`w-full p-2.5 pt-5 border border-gray outline-none 
                rounded-md ${isValid != undefined && !isValid && !inputEmpty ? 
                "border-red-500" : "group-focus-within:border-xblue"}`} 
            />
            <label className={`absolute
             text-gray-400 ${labelStyle} ${isValid != undefined && !isValid && !inputEmpty ? 
                "text-red-500" : "group-focus-within:text-xblue"}
                group-focus-within:text-[0.8em] transition-all group-focus-within:top-1 group-focus-within:left-3 
              ${!inputEmpty ? "text-[0.8em] top-1 left-3" : "top-4 left-3"}`}
            >{label}
            </label>
        </div>
    );
}

export default FormInput;