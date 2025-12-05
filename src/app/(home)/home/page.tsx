import { auth } from "@/auth";
import HomeWrapper from "@/components/home/HomeWrapper"
import { prisma } from "@/lib/prisma";

export default async function Page() {
    const session = await auth();

    let user = null;

    if (session) {
        user = await prisma.users.findUnique({
            where: {
                UserID: parseInt(session?.user.id)
            },
            select: {
                UserID: true,
                Username: true,
                DisplayName: true,
                Website: true,
                Location: true,
                ProfilePicture: true,
                CoverPicture: true,
                Bio: true,
                followers: true,
                following: true,
            }
        });
    }

    return (
        <>
            {user && (
                <HomeWrapper user={user} />
            )}
        </>
    );
}