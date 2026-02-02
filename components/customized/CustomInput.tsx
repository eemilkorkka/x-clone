import React, { useState } from "react";
import { Input } from "../ui/input"
import { ControllerFieldState } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { colorsArray } from "@/lib/colors";
import { useColor } from "@/context/ColorContext";

interface CustomInputProps {
    type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    label: string;
    maxLength?: number;
    value: string;
    styles?: string;
    fieldState?: ControllerFieldState;
    disabled?: boolean;
    toggleToSeePassword?: boolean;
}

export const CustomInput = (
    {
        type,
        label,
        maxLength,
        value,
        styles,
        fieldState,
        disabled,
        toggleToSeePassword = false,
        ...field
    }: CustomInputProps) => {

    const [showPassword, setShowPassword] = useState(false);
    const pathname = usePathname();
    const { colors } = useColor();
    
    const useChosenColor = pathname !== "/" && pathname !== "/signup";
    const borderFocusColor = useChosenColor ? colors.focusVisibleBorderColor : colorsArray[0].focusVisibleBorderColor;
    const textFocusColor = useChosenColor ? colors.peerFocusTextColor : colorsArray[0].peerFocusTextColor;

    return (
        <div className="relative">
            <Input
                {...field}
                type={showPassword ? "text" : type}
                maxLength={maxLength}
                disabled={disabled}
                value={value}
                className={cn(
                    "peer py-6.5 text-foreground px-4 focus-visible:ring-0 rounded-sm shadow-none",
                    disabled ? "bg-zinc-800" : "!bg-transparent",
                    fieldState?.error ? "!border-destructive focus-visible:border-destructive" : `border-zinc-800 ${borderFocusColor}`,
                    styles
                )}
            />
            <label className={cn(
                "text-gray-500 absolute peer-focus-within:top-3 text-sm peer-focus-within:text-xs -translate-y-1/2 left-4 pointer-events-none transition-top duration-200 ease-in-out",
                value.length === 0 ? "top-1/2" : "top-3",
                fieldState?.error ? "!text-destructive" : textFocusColor
            )}>
                {label}
            </label>
            {maxLength && <span className="hidden peer-focus-within:inline absolute text-sm top-2 right-4 text-gray-500">{`${value?.length ?? 0} / ${maxLength}`}</span>}
            {toggleToSeePassword &&
                <div className="absolute top-1/2 -translate-y-1/2 right-4 hover:cursor-pointer">
                    {showPassword ? (
                        <FaRegEyeSlash fill="white" onClick={() => setShowPassword(false)} />
                    ) : (
                        <FaRegEye fill="white" onClick={() => setShowPassword(true)} />
                    )}
                </div>
            }
        </div>
    )
}