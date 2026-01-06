import toast from "react-hot-toast";

const toastStyles = {
    backgroundColor: "#0EA5E9",
    color: "#FFFF"
}

export const toastMessage = ( message: string, success: boolean) => {
    success ? toast.success(message, { style: toastStyles }) : 
    toast.error(message, { style: toastStyles });
}