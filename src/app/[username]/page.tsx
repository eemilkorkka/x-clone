import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const response = await fetch(`http://localhost:3000/api/users/${username}`);
    const data = await response.json();

    return (
        <ProtectedRoute>
            <Layout>
                {data.user ? (
                    <p>Profile of {data.user.Username}</p>
                ) : (
                    <p>{data.message}</p>
                )}
            </Layout>
        </ProtectedRoute>
    );
}
