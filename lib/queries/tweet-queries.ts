import { prisma } from "../prisma";

export const getAllTweets = async () => {
    return await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    image: true,
                },
            },
            file: true,
        },
        orderBy: [
            { createdAt: 'desc' },
        ]
    });
}