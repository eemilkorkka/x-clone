import { cn } from "@/lib/utils";
import { ControllerFieldState } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useColor } from "@/context/ColorContext";

interface CustomTextareaProps {
    label: string;
    maxLength?: number;
    value: string;
    styles?: string;
    fieldState?: ControllerFieldState;
}

export const CustomTextarea = (
    {
        label,
        maxLength,
        value,
        styles,
        fieldState,
        ...field
    }: CustomTextareaProps) => {
    
    const { colors } = useColor();

    return (
        <div className="relative">
            <Textarea
                {...field}
                maxLength={maxLength}
                value={value}
                className={cn(
                    "peer py-6.5 text-foreground px-4 focus-visible:ring-0 rounded-sm !bg-transparent",
                    fieldState?.error ? "border-destructive focus-visible:border-destructive" : `border-zinc-800 ${colors.focusVisibleBorderColor}`,
                    styles
                )}
            />
            <label className={cn(
                "text-gray-500 absolute peer-focus-within:top-4 peer-focus-within:text-xs -translate-y-1/2 left-4 pointer-events-none transition-top duration-200 ease-in-out",
                fieldState?.error ? "!text-destructive" : colors.peerFocusTextColor,
                value.length === 0 ? "top-6" : "top-4"
            )}>
                {label}
            </label>
            {maxLength && <span className="hidden peer-focus-within:inline absolute text-sm top-2 right-4 text-gray-500">{`${value?.length ?? 0} / ${maxLength}`}</span>}
        </div>
    )
}