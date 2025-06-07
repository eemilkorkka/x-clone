import { LoadingSpinner } from "@/components/Shared/LoadingSpinner";

interface LoadingBlockProps {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    status: "error" | "success" | "pending";
}

const LoadingBlock = ({ isFetchingNextPage, hasNextPage, status }: LoadingBlockProps) => {
    return  (
        <div className={`flex justify-center p-10 w-full`}>
            {(status === "pending" || isFetchingNextPage) && <LoadingSpinner variant="blue" />}
        </div>
    );
}

export default LoadingBlock;