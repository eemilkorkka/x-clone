import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await auth();

    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const userToBeFollowed = await prisma.users.findUnique({
        where: {
            Username: username
        },
        select: {
            UserID: true
        }
    });

    if (!userToBeFollowed) return NextResponse.json({ message: "User not found." }, { status: 404 });

    if (userToBeFollowed.UserID === parseInt(session.user.id)) {
        return NextResponse.json({ message: "You cannot follow yourself." }, { status: 400 });
    }

    try {
        const isFollowing = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: parseInt(session.user.id),
                    followingId: userToBeFollowed.UserID
                }
            }
        });

        if (isFollowing) {
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: parseInt(session.user.id),
                        followingId: userToBeFollowed.UserID
                    }
                }
            });

            return NextResponse.json({ message: `Unfollowed @${username}` }, { status: 200 });
        } else {
            await prisma.follows.create({
                data: {
                    followerId: parseInt(session.user.id),
                    followingId: userToBeFollowed.UserID,
                }
            });

            return NextResponse.json({ message: `Followed @${username}` }, { status: 200 });
        }
    } catch {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}