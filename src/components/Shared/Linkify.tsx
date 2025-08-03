import { DisplayContext } from "@/Context/DisplayContext";
import React, { useContext } from "react"
import { textColors } from "@/utils/colors";
import ProfileHoverCard from "../Profile/ProfileHoverCard";

const Linkify = ({ text }: { text: string }) => {
    const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
    const lines = text.split("\n");

    const { selectedIndex } = useContext(DisplayContext)!;

    return (
        <div className="break-words">
            {lines.map((line, lineIndex) => (
                <div key={lineIndex}>
                    {line.split(" ").map((word, index) => {
                        const isUsername = word.includes("@");

                        return isUsername ? (
                            <ProfileHoverCard username={word.slice(1)} key={index}>
                                <span>
                                    <a href={`/${word.slice(1)}`} target="_parent" className={`${textColors[selectedIndex ?? 0].color} no-underline hover:underline`}>{word}</a>
                                    {' '}
                                </span>
                            </ProfileHoverCard>
                        ) : (
                            word.match(urlPattern) ? (
                                <React.Fragment key={index}>
                                    <a href={word} target="_blank" className={`${textColors[selectedIndex ?? 0].color} no-underline hover:underline`}>{word}</a>
                                    {' '}
                                </React.Fragment>
                            ) : (
                                <React.Fragment key={index}>
                                    {word}
                                    {' '}
                                </React.Fragment>
                            )
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Linkify;
