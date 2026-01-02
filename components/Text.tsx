import Link from "next/link";
import { twMerge } from "tailwind-merge";

const urlPattern = /\b((https?:\/\/|www\.)[^\s/$.?#].[^\s]*)/gi;

export const Text = ({ text, styles }: { text: string, styles?: string }) => {
    const words = text.split(" ");

    return (
        <span className={twMerge("text-[15px] text-white ml-2 text-black", styles)} style={{ wordBreak: "break-word" }}>
            {words.map((word, index) => (
                word.includes("@") || word.match(urlPattern) ? <Link key={index} className="text-purple" href={`${word.replace("@", "")}`} target="_blank" rel="noopener noreferrer">{`${word} `}</Link> : word + " "
            ))}
        </span>
    )
}