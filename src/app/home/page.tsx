import { auth } from "@/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;

    return (
        <ProtectedRoute>
            <div>Hello {email}, welcome to /home</div>
        </ProtectedRoute>
    );
}