export const UserSkeleton = () => {
    return (
        <div className="flex items-center hover:bg-ring/20 w-full p-2 hover:cursor-pointer">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 animate-pulse"></div>
            <div className={"flex-1 flex w-full items-start flex-col space-y-2"}>
                <div className="w-20 h-2 rounded-md bg-gray-300 animate-pulse"></div>
                <div className="w-15 h-2 rounded-md bg-gray-300 animate-pulse"></div>
            </div>
        </div>
    )
}