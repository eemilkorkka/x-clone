"use client";

import { useColor } from "@/context/ColorContext";
import { Spinner } from "./spinner"

export const LoadingSpinner = () => {

    const { colors } = useColor();

    return (
        <Spinner className={`flex w-full ${colors.textColor} h-8 mt-4`} />
    )
}