import { prisma } from "../prisma"

export const getUserByUsernameOrEmail = async (value: string) => {
    if (value.includes("@")) {
        return prisma.user.findUnique({
            where: { email: value },
            omit: {
                email: true,
                emailVerified: true,
                birthDateMonth: true,
                birthDateDay: true,
                birthDateYear: true
            }
        });
    }

    return prisma.user.findUnique({
        where: { username: value },
        include: {
            following: {
                select: {
                    followingId: true,
                    createdAt: true,
                }
            },
            followers: {
                select: {
                    followerId: true,
                    createdAt: true,
                }
            }
        },
        omit: {
            email: true,
            emailVerified: true,
            birthDateMonth: true,
            birthDateDay: true,
            birthDateYear: true
        }
    });
}

export const getUsersByUsernameOrDisplayname = async (value: string) => {
    return await prisma.user.findMany({
        where: {
            OR: [
                { username: { startsWith: value, mode: "insensitive" } },
                { displayUsername: { startsWith: value, mode: "insensitive" } }
            ]
        },
        omit: {
            email: true,
            emailVerified: true,
            birthDateMonth: true,
            birthDateDay: true,
            birthDateYear: true
        },
        take: 10
    });
}

export const getFollowersByUsername = async (username: string, cursor?: { createdAt: Date; id: string }) => {
    const users = await prisma.user.findMany({
        where: {
            following: {
                some: {
                    following: {
                        username: username
                    }
                }
            }
        },
        include: {
            followers: {
                select: {
                    followerId: true,
                }
            },
            following: {
                select: {
                    followingId: true,
                }
            }
        },
        omit: {
            email: true,
            emailVerified: true,
            birthDateMonth: true,
            birthDateDay: true,
            birthDateYear: true
        },
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' },
        ],
        take: 20,
        ...(cursor && {
            skip: 1,
            cursor: {
                id: cursor.id,
            },
        }),
    });

    const last = users[users.length - 1];
    return {
        items: users,
        nextCursor: last ? { createdAt: last.createdAt, id: last.id } : null,
    };
}

export const getFollowingByUsername = async (username: string, cursor?: { createdAt: Date; id: string }) => {
    const users = await prisma.user.findMany({
        where: {
            followers: {
                some: {
                    follower: {
                        username: username
                    }
                }
            }
        },
        include: {
            followers: {
                select: {
                    followerId: true,
                }
            },
            following: {
                select: {
                    followingId: true,
                }
            }
        },
        omit: {
            email: true,
            emailVerified: true,
            birthDateMonth: true,
            birthDateDay: true,
            birthDateYear: true
        },
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' },
        ],
        take: 20,
        ...(cursor && {
            skip: 1,
            cursor: {
                id: cursor.id,
            },
        }),
    });

    const last = users[users.length - 1];
    return {
        items: users,
        nextCursor: last ? { createdAt: last.createdAt, id: last.id } : null,
    };
}