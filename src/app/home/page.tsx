import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import LeftSideBar from "@/components/Layout/LeftSideBar/LeftSideBar";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;

    return (
        <ProtectedRoute>
            <Layout>middle</Layout>
        </ProtectedRoute>
    );
}