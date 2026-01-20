"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function follow(userId: string) {

    const session = await getSession();

    if (!session) {
        return { error: "Not authenticated." };
    }

    if (userId == session.user.id) {
        return { error: "Cannot follow yourself." }
    }

    try {
        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: userId
                }
            }
        });

        if (isFollowing) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: session.user.id,
                        followingId: userId
                    }
                }
            });

            return { success: true };
        } else {
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: userId
                }
            });

            return { success: true };
        }
    } catch (error) {
        return { error: "Internal Server Error." };
    }
}