import { Progress } from "radix-ui";

const IndeterminateProgress = () => {
    return (
        <Progress.Root className="bg-xblue/30 w-full h-1">
            <Progress.Indicator className="bg-xblue size-full animate-progress" />
        </Progress.Root>
    );
}

export default IndeterminateProgress;