"use client";

import formDataType from "@/types/formDataType";
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";

interface FormInputProps {
    type: string;
    name: keyof formDataType;
    label: string;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    style?: CSSProperties;
    isValid?: boolean;
    isReadOnly?: boolean;
}

const FormInput = ({ type, name, label, formData, onChange, style, isValid, isReadOnly }: FormInputProps) => {

    const [inputEmpty, setInputEmpty] = useState<boolean>(formData[name] === "");

    useEffect(() => {
        console.log(inputEmpty)
    }, [inputEmpty]);

    return (
        <div className="relative group" style={style}>
            <input 
                type={type}
                name={name}
                value={formData[name]}
                readOnly={isReadOnly}
                onChange={(e) => { 
                    onChange(e); 
                    e.target.value === "" ? setInputEmpty(true) : setInputEmpty(false) 
                }}
                className={`w-full p-2.5 pt-5 border border-gray outline-none 
                    rounded-md ${isValid != undefined && !isValid && !inputEmpty ? 
                        "group-focus-within:border-red-500" : "group-focus-within:border-xblue"}`} 
            />
            <label className={`absolute
             text-gray-400 ${isValid != undefined && !isValid && !inputEmpty ? "group-focus-within:text-red-500" : "group-focus-within:text-xblue"}
              group-focus-within:text-[0.8em] group-focus-within:top-1 group-focus-within:left-3 
              ${!inputEmpty ? "text-[0.8em] top-1 left-3" : "top-4 left-3"}`}
            >{label}</label>
        </div>
    );
}

export default FormInput;