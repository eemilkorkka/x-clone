"use client";
import { DisplayContext } from "@/Context/DisplayContext";
import formDataType from "@/types/formDataType";
import { ChangeEvent, HTMLInputTypeAttribute, useContext } from "react";
import { borderColors, textColors } from "../Layout/LeftSideBar/DisplayDialog/DisplayDialog";
import { usePathname } from "next/navigation";

interface FormInputProps {
    type?: HTMLInputTypeAttribute;
    name: string;
    label: string;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    style?: string;
    labelStyle?: string;
    error?: string;
    errorStyle?: string;
    isTextArea?: boolean;
    maxLength?: number;
}

const FormInput = ({
    type,
    name,
    label,
    formData,
    onChange,
    style,
    labelStyle,
    error,
    errorStyle,
    isTextArea = false,
    maxLength
}: FormInputProps) => {

    const { selectedIndex } = useContext(DisplayContext)!;
    const pathname = usePathname();

    const isRootPath = pathname === "/";
    const inputEmpty: boolean = formData[name] === "";

    const inputClassName = `w-full p-2.5 pt-5 border border-gray outline-none 
        rounded-md ${style} ${error ? "border-red-500" : (isRootPath ? "group-focus-within:border-xblue" : borderColors[selectedIndex ?? 0].color)}`;

    return (
        <div className="relative group hover:cursor-pointer">
            {isTextArea ? (
                <textarea
                    name={name}
                    value={formData[name]}
                    onChange={onChange}
                    maxLength={maxLength}
                    className={inputClassName}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={onChange}
                    maxLength={maxLength}
                    className={inputClassName}
                />
            )}          
            <label className={`absolute
             text-gray-400 ${labelStyle} ${error ? "text-red-500" : (isRootPath ? "group-focus-within:text-xblue" : textColors[selectedIndex ?? 0].groupFocusText)}
                group-focus-within:text-[0.8em] transition-all group-focus-within:top-1 group-focus-within:left-3 
              ${!inputEmpty ? "text-[0.8em] top-1 left-3" : "top-4 left-3"}`}
            >{label}
            </label>
            {error && <p className={`text-red-500 h-4 mt-2 ${errorStyle}`}>{error}</p>}
        </div>
    );
}

export default FormInput;