import { prisma } from "../prisma";

export const getTweets = async (cursor?: { createdAt: Date; id: number }) => {
    const tweets = await prisma.tweet.findMany({
        where: {
            parentTweetId: null
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    image: true,
                },
            },
            files: true,
            likes: true,
            bookmarks: true,
            _count: {
                select: {
                    replies: true
                }
            },
            retweets: true,
            originalTweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                        },
                    },
                    files: true,
                    likes: true,
                    bookmarks: true,
                    retweets: true,
                    _count: {
                        select: {
                            replies: true
                        }
                    }
                }
            }
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

    const last = tweets[tweets.length - 1];

    return {
        items: tweets,
        nextCursor: last ? { createdAt: last.createdAt, id: last.id } : null,
    };
}

export const getRepliesByTweetId = async (id: number, cursor?: { createdAt: Date; id: number }) => {
    const tweets = await prisma.tweet.findMany({
        where: {
            parentTweetId: id
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    image: true,
                },
            },
            files: true,
            likes: true,
            bookmarks: true,
            _count: {
                select: {
                    replies: true
                }
            },
            retweets: true,
            originalTweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                        },
                    },
                    files: true,
                    likes: true,
                    bookmarks: true,
                    retweets: true,
                    _count: {
                        select: {
                            replies: true
                        }
                    }
                }
            }
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

    const last = tweets[tweets.length - 1];

    return {
        items: tweets,
        nextCursor: last ? { createdAt: last.createdAt, id: last.id } : null,
    };
}

export const getTweetById = async (id: number) => {
    return await prisma.tweet.findUnique({
        where: {
            id: id
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    image: true,
                },
            },
            files: true,
            bookmarks: true,
            likes: true,
            _count: {
                select: {
                    replies: true
                }
            },
            retweets: true,
            parentTweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                        },
                    },
                    files: true,
                    likes: true,
                    bookmarks: true,
                    retweets: true,
                    _count: {
                        select: {
                            replies: true
                        }
                    }
                }
            },
            originalTweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                        },
                    },
                    files: true,
                    likes: true,
                    bookmarks: true,
                    retweets: true,
                    _count: {
                        select: {
                            replies: true
                        }
                    }
                }
            }
        }
    });
}

