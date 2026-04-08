export const Separator = ({ text = "OR" }: { text?: string }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="border-b border-zinc-800 w-full" />
            <span className="text-white text-sm text-zinc-200">{text}</span>
            <div className="border-b border-zinc-800 w-full" />
        </div>
    )
}