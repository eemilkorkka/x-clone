"use client";

import {
    Field,
    FieldContent,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useColor } from "@/context/ColorContext";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type Theme = {
    name: string;
    value: string;
    background: string;
    hasDataCheckedBackground: string;
    styles: string;
}

const themes = [
    {
        name: "Default",
        value: "light",
        background: "bg-white",
        hasDataCheckedBackground: "has-data-checked:bg-white",
        styles: "!text-black"
    },
    {
        name: "Dim",
        value: "dim",
        background: "bg-dim",
        hasDataCheckedBackground: "has-data-checked:bg-dim",
        styles: "text-white"
    },
    {
        name: "Lights out",
        value: "dark",
        background: "bg-black",
        hasDataCheckedBackground: "has-data-checked:bg-black",
        styles: "text-white !bg-black"
    }
];

export const ThemeSelection = () => {

    const { colors } = useColor();
    const { setTheme, resolvedTheme } = useTheme();

    const onThemeSelect = (theme: Theme) => {
        setTheme(theme.value);
        localStorage.setItem("selectedTheme", theme.value);
    }

    return (
        <div className="-mx-4 px-4 py-2">
            <h2 className="font-bold text-lg">Background</h2>
            <div className="flex justify-between mt-4">
                <RadioGroup defaultValue={resolvedTheme} className="flex flex-col md:flex-row">
                    {themes.map((theme, index) => (
                        <FieldLabel key={index} className={cn("p-2 !rounded-sm border-border has-data-checked:!border-2 hover:cursor-pointer",
                            colors.checkedBorderColor, theme.background,
                            theme.hasDataCheckedBackground, theme.styles)}
                            onClick={() => onThemeSelect(theme)}>
                            <Field orientation="horizontal" className="space-x-6">
                                <RadioGroupItem value={theme.value} className={cn("border-gray-500 border-2", colors.checkedBorderColor, colors.checkedColor)} />
                                <FieldContent>
                                    <FieldTitle>{theme.name}</FieldTitle>
                                </FieldContent>
                            </Field>
                        </FieldLabel>
                    ))}
                </RadioGroup>
            </div>
        </div>
    )
}