
interface IconsProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export const Icon = ({ children, onClick }: IconsProps) => {
    return (
        <div className="rounded-full w-fit h-fit text-sky-500 hover:bg-sky-500/20 hover:cursor-pointer p-2" onClick={onClick}>
            {children}
        </div>
    )
}