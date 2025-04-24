const Linkify = ({ text }: { text: string }) => {
    const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
    const words = text.split(" ");

    return (
        <>
            {words.map((word, index) => {
                return word.match(urlPattern) ? 
                <a key={index} href={word} target="_blank" className="text-xblue no-underline hover:underline">{word}</a> : word + " ";
            })}
        </>
    );
}

export default Linkify;