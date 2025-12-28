export const FeedHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex sticky top-0 h-13 border-b border-gray-200">
            {children}
        </div>
    )
}