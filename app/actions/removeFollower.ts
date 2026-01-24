"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function removeFollower(followerId: string) {
    const session = await getSession();

    if (!session) {
        return { error: "Not authenticated." };
    }

    try {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: session.user.id
                }
            }
        });

        return { success: true };
    } catch (error) {
        return { error: "Internal Server Error." };
    }
}