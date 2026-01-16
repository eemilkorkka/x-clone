"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useColor } from "@/context/ColorContext";

const urlPattern = /\b((https?:\/\/|www\.)[^\s/$.?#].[^\s]*)/gi;

export const Text = ({ text, styles }: { text: string, styles?: string }) => {
    
    if (!text) return null;
    
    const { colors } = useColor();
    const words = text.split(" ");

    return (
        <span className={cn("text-[15px] text-black", styles)} style={{ wordBreak: "break-word" }}>
            {words.map((word, index) => {
                const isUsername = word.includes("@");

                return (
                    isUsername || word.match(urlPattern) ?
                        <Link
                            key={index}
                            className={colors.textColor}
                            href={`${isUsername ? "/" + word.replace("@", "") : word.replace("@", "")}`}
                            target={isUsername ? "_self" : "_blank"}
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}>
                            {`${word} `}
                        </Link>
                        : word + " "
                )
            })}
        </span>
    )
}