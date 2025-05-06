interface UsernameProps {
    username: string;
}

const Username = ({ username }: UsernameProps) => {
    return (
        <span className="text-gray-500 whitespace-nowrap text-[15px]">@{username}</span>
    );
}

export default Username;