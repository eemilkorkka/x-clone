import { PasswordResetForm } from "@/components/PasswordReset/PasswordResetForm";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

export default function ResetPasswordPage() {
    return (
        <div>
            <div className="flex gap-6 items-center border-b border-border px-8 md:px-25 py-4">
                <Link href="/">
                    <FaXTwitter size={35} />
                </Link>
                <h1 className="text-xl font-bold">Password Reset</h1>
            </div>
            <PasswordResetForm />
        </div>
    )
}