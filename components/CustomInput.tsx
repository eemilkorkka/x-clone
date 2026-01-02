import React, { SetStateAction, useState } from "react";
import { Input } from "./ui/input"
import { ControllerFieldState } from "react-hook-form";

interface CustomInputProps {
    type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    label: string;
    maxLength?: number;
    value: string;
    fieldState?: ControllerFieldState;
    disabled?: boolean;
}

export const CustomInput = ({ type, label, maxLength, value, fieldState, disabled, ...field }: CustomInputProps) => {
    return (
        <div className="relative">
            <Input
                {...field} 
                type={type}
                maxLength={maxLength}
                disabled={disabled}
                value={value}
                className={`peer py-6.5 ${disabled && "bg-zinc-800"} ${fieldState?.error ? "border-destructive" : "border-zinc-800"} px-4 ${fieldState?.error ? "focus-visible:border-destructive" : "focus-visible:border-sky-500"} focus-visible:ring-0 rounded-sm`} 
            />
            <label className={`text-gray-500 absolute peer-focus-within:top-3 peer-focus-within:text-xs ${value.length === 0 ? "top-1/2" : "top-3"} -translate-y-1/2 left-4 ${fieldState?.error ? "peer-focus-visible:text-destructive" : "peer-focus-visible:text-sky-500"} pointer-events-none transition-top duration-200 ease-in-out`}>
                {label}
            </label>
            {maxLength && <span className="absolute text-sm top-2 right-4 text-gray-500">{`${value?.length ?? 0} / ${maxLength}`}</span> }
        </div>
    )
}