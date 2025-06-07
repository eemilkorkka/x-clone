import React from "react"
const Linkify = ({ text }: { text: string }) => {
    const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
    const words = text.split(" ");

    return (
        <span className="break-words">
            {words.map((word, index) => {
                const isUsername = word.includes("@");
                return (
                    <React.Fragment key={index}>
                        {word.match(urlPattern) || isUsername ? (
                            <a href={isUsername ? `/${word.slice(1)}` : word} target={isUsername ? "_parent" : "_blank"} className="text-xblue no-underline hover:underline">{word}</a>
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