import { prisma } from "@/lib/prisma";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "../ui/card";
import { getSession } from "@/lib/session";

import { User } from "./User";
import { FollowButton } from "./FollowButton";

export const SuggestedUsersCard = async () => {

    const session = await getSession();

    const users = await prisma.user.findMany({
        where: {
            username: {
                not: null
            },
            NOT: {
                OR: [
                    { id: session?.user.id },
                    {
                        followers: {
                            some: {
                                followerId: session?.user.id
                            }
                        }
                    }
                ]
            },
        },
        select: {
            id: true,
            username: true,
            displayUsername: true,
            website: true,
            bio: true,            
            image: true,
            followers: {
                select: {
                    followerId: true,
                }
            },
        },
        take: 3
    });

    if (users.length < 1) return null;

    return (
        <Card className="py-4 shadow-none border-1 border-foreground/10 ring-0 gap-2 pb-0">
            <CardHeader className="px-4">
                <CardTitle className="font-bold text-xl">Who to follow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {users.map((user) => {
                    const isFollowing = user.followers.some(follower => follower.followerId === session?.user.id);

                    return (
                        <User key={user.id} user={user} useLink={true}>
                            <FollowButton userId={user.id} username={user.username ?? ""} isFollowing={isFollowing} />
                        </User>
                    )
                })}
            </CardContent>
        </Card>
    )
}