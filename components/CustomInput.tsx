import React, { SetStateAction } from "react";
import { Input } from "./ui/input"
import { SelectValue } from "@base-ui/react";

interface CustomInputProps {
    type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    label: string;
    maxLength?: number;
    value?: string;
    setValue?: React.Dispatch<SetStateAction<string>>;
}

export const CustomInput = ({ type, label, maxLength, value, setValue }: CustomInputProps) => {
    
    return (
        <div className="relative">
            <Input 
                type={type}
                value={value}
                onChange={(e) => setValue?.(e.currentTarget.value)} 
                maxLength={maxLength}
                className="peer py-6.5 px-4 focus-visible:border-sky-500 focus-visible:ring-0 rounded-sm" 
            />
            <label className="text-gray-500 absolute peer-focus-within:top-3 peer-focus-within:text-xs top-1/2 -translate-y-1/2 left-4 peer-focus-visible:text-sky-500 pointer-events-none transition-top duration-200 ease-in-out">
                {label}
            </label>
            {maxLength && <span className="absolute text-sm top-2 right-4 text-gray-500">{`${value?.length ?? 0} / ${maxLength}`}</span> }
        </div>
    )
}