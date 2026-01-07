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
