import { prisma } from "../prisma"

export const getUserByUsernameOrEmail = async (value: string) => {
    if (value.includes("@")) {
        return prisma.user.findUnique({
            where: { email: value },
        });
    }

    return prisma.user.findUnique({
        where: { username: value },
    });
}
