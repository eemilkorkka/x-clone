import ForgotPasswordDialog from "@/components/ForgotPasswordDialog/ForgotPasswordDialog";
import { Toaster } from "react-hot-toast";

export default async function Page() {
    return (
        <div className="w-full h-full bg-black">
            <ForgotPasswordDialog />
            <Toaster position="bottom-center" />
        </div>
    );
}