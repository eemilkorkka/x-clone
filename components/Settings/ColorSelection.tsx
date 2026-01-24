"use client";

import { ColorsType, useColor } from "@/context/ColorContext";
import { colorsArray } from "@/lib/colors";
import { IoMdCheckmark } from "react-icons/io";

export const ColorSelection = () => {

    const { colors, setColors } = useColor();

    const handleColorChange = (colorObj: ColorsType) => {
        setColors(colorObj);
        localStorage.setItem("color", JSON.stringify(colorObj));
    }

    return (
        <div className="border-y border-border -mx-4 px-4 py-2">
            <h2 className="font-bold text-lg">Color</h2>
            <div className="flex justify-between p-4">
                {colorsArray.map((colorObj, index) => {

                    const isActive = colorsArray[index].color === colors.color;

                    return (
                        <button key={index} className={`rounded-full hover:cursor-pointer w-10 h-10 ${colorObj.color}`} onClick={() => handleColorChange(colorObj)}>
                            {isActive && (
                                <IoMdCheckmark className="text-white mx-auto" size={24} />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}