import { useColor } from "@/context/ColorContext";
import { allowedPaths } from "@/lib/paths";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export const useToastMessage = () => {

    const { colors } = useColor();
    const pathname = usePathname();

    const useChosenColor = !allowedPaths.includes(pathname);

    const toastStyles = {
        backgroundColor: useChosenColor ? colors.hexColor : "#0ea5e9",
        color: "#FFFF"
    }

    const toastMessage = (message: string, success: boolean) => {
        success ? toast.success(message, { style: toastStyles }) :
            toast.error(message, { style: toastStyles });
    }

    return { toastMessage };
}