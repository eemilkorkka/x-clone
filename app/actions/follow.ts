"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function follow(formData: FormData) {

    const session = await getSession();

    if (!session) {
        return { error: "Not authenticated." };
    }

    const userIdToFollow = formData.get("userId") as string;

    if (userIdToFollow == session.user.id) {
        return { error: "Cannot follow yourself." }
    }

    try {
        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: userIdToFollow
                }
            }
        });

        if (isFollowing) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: session.user.id,
                        followingId: userIdToFollow
                    }
                }
            });

            return { success: true };
        } else {
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: userIdToFollow
                }
            });

            return { success: true };
        }
    } catch (error) {
        return { error: "Internal Server Error." };
    }
}