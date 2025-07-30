import { DisplayContext } from "@/Context/DisplayContext";
import React, { useContext } from "react"
import { textColors } from "@/utils/colors";
const Linkify = ({ text }: { text: string }) => {
    const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
    const words = text.split(" ");

    const { selectedIndex } = useContext(DisplayContext)!;

    return (
        <span className="break-words">
            {words.map((word, index) => {
                const isUsername = word.includes("@");
                return (
                    <React.Fragment key={index}>
                        {word.match(urlPattern) || isUsername ? (
                            <a href={isUsername ? `/${word.slice(1)}` : word} target={isUsername ? "_parent" : "_blank"} className={`${textColors[selectedIndex ?? 0].color} no-underline hover:underline`}>{word}</a>
                        ) : (
                            word
                        )}
                        {' '}
                    </React.Fragment>
                );
            })}
        </span>
    );
}

export default Linkify;