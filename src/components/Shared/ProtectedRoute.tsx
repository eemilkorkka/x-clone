import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ProtectedRoute = async ({ children }: { children: ReactNode }) => {
    const session = await auth();

    if (!session?.user) return redirect("/");

    return (
        <>
            {children}
        </>
    );
}

export default ProtectedRoute;