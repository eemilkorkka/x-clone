import { auth } from "@/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default async function Page() {
    const session = await auth();
    const username = session?.user.username;

    return (
        <ProtectedRoute>
            <div>Hello {username}, welcome to /home</div>
        </ProtectedRoute>
    );
}