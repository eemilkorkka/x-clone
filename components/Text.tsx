"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useColor } from "@/context/ColorContext";
import { ProfileHoverCard } from "./Profile/ProfileHoverCard";

const urlPattern = /\b((https?:\/\/|www\.)[^\s/$.?#].[^\s]*)/gi;

export const Text = ({ text, styles }: { text: string, styles?: string }) => {

    if (!text) return null;

    const { colors } = useColor();
    const words = text.split(" ");

    const renderLink = (index: number, word: string, isUsername: boolean) => {
        return (
            <Link
                key={index}
                className={cn("hover:underline", colors.textColor)}
                href={`${isUsername ? "/" + word.replace("@", "") : word.replace("@", "")}`}
                target={isUsername ? "_self" : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}>
                {`${word} `}
            </Link>
        )
    }

    return (
        <span className={cn("text-[15px]", styles)} style={{ wordBreak: "break-word" }}>
            {words.map((word, index) => {
                const isUsername = word.includes("@");

                return (
                    isUsername || word.match(urlPattern) ?
                        isUsername ? (
                            <ProfileHoverCard key={index} username={word.replace("@", "")}>
                                {renderLink(index, word, true)}
                            </ProfileHoverCard>
                        ) : (
                            renderLink(index, word, false)
                        )
                        : word + " "
                )
            })}
        </span>
    )
}