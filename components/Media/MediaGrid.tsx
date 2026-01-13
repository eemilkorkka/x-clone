export const MediaGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-3 gap-1">
            {children}
        </div>
    )
}