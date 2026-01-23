import { useColor } from "@/context/ColorContext";
import toast from "react-hot-toast";

export const UseToastMessage = () => {

    const { colors } = useColor();

    const toastStyles = {
        backgroundColor: colors.hexColor,
        color: "#FFFF"
    }

    const toastMessage = (message: string, success: boolean) => {
        success ? toast.success(message, { style: toastStyles }) :
            toast.error(message, { style: toastStyles });
    }

    return { toastMessage };
}