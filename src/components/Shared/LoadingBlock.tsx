import { LoadingSpinner } from "@/components/Shared/LoadingSpinner";

interface LoadingBlockProps {
    isFetchingNextPage: boolean;
    status: "error" | "success" | "pending";
}

const LoadingBlock = ({ isFetchingNextPage, status }: LoadingBlockProps) => {
    return  (
        <div className={`flex justify-center p-10 w-full`}>
            {(status === "pending" || isFetchingNextPage) && <LoadingSpinner variant="color" />}
        </div>
    );
}

export default LoadingBlock;