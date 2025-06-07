import { prisma } from "@/lib/prisma";

export const getTweetById = async (tweetId: number) => {
    const tweet = await prisma.posts.findUnique({
        where: {
            ID: tweetId
        },
        include: {
            users: {
                select: {
                    DisplayName: true,
                    Username: true,
                    ProfilePicture: true,
                }
            },
            files: true,
            likes: {
                select: {
                    UserID: true
                }
            },
            replies: {
                select: {
                    UserID: true
                }
            },
            bookmarks: {
                select: {
                    UserID: true
                }
            }
        },
    });

    return tweet;
}

export const getTweetsByUsername = async (username: string, page: number, limit: number) => {
    const tweets = await prisma.posts.findMany({
        where: {
            users: {
                Username: username,
            },
            ParentID: null,
        },
        include: {
            users: {
                select: {
                    Username: true,
                    DisplayName: true,
                    ProfilePicture: true,
                },
            },
            files: true,
            likes: {
                select: {
                    UserID: true,
                },
            },
            replies: {
                select: {
                    UserID: true,
                }
            },
            bookmarks: {
                select: {
                    UserID: true,
                }
            }
        },
        orderBy: {
            created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return tweets;
}

export const getTweets = async (page: number, limit: number) => {
    const tweets = await prisma.posts.findMany({
            where: {
                ParentID: null
            },
            include: {
                users: {
                    select: {
                        Username: true,
                        DisplayName: true,
                        ProfilePicture: true,
                    },
                },
                files: true,
                likes: {
                    select: {
                        UserID: true,
                    },
                },
                replies: {
                    select: {
                        UserID: true,
                    }
                },
                bookmarks: {
                    select: {
                        UserID: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            },
            skip: (page - 1) * limit,
            take: limit,
    });

    return tweets;
}

export const getReplies = async (tweetId: number, page: number, limit: number) => {
    const replies = await prisma.posts.findMany({
        where: {
            ParentID: tweetId,
        },
        include: {
            users: {
                select: {
                    Username: true,
                    DisplayName: true,
                    ProfilePicture: true,
                },
            },
            files: true,
            likes: {
                select: {
                    UserID: true,
                },
            },
            replies: {
                select: {
                    UserID: true,
                }
            },
            bookmarks: {
                select: {
                    UserID: true,
                }
            }
        },
        orderBy: {
            created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return replies;
}

export const getTweetsAndRepliesByUsername = async (username: string, page: number, limit: number) => {
    const tweets = await prisma.posts.findMany({
        where: {
            users: {
                Username: username,
            },
        },
        include: {
            users: {
                select: {
                    Username: true,
                    DisplayName: true,
                    ProfilePicture: true,
                },
            },
            files: true,
            likes: {
                select: {
                    UserID: true,
                },
            },
            replies: {
                select: {
                    UserID: true,
                }
            },
            bookmarks: {
                select: {
                    UserID: true,
                }
            }
        },
        orderBy: {
            created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return tweets;
}

export const getLikedTweets = async (userId: number, page: number, limit: number) => {
    const likes = await prisma.likes.findMany({
        where: {
            UserID: userId
        },
        include: {
            post: {
                include: {
                    users: {
                        select: {
                            Username: true,
                            DisplayName: true,
                            UserID: true,
                            ProfilePicture: true,
                        },
                    },
                    files: true,
                    likes: {
                        select: {
                            UserID: true,
                        },
                        orderBy: {
                            created_at: 'desc',
                        },
                    },
                    replies: { 
                        select: {
                            UserID: true,
                        }
                    },
                    bookmarks: {
                        select: {
                            UserID: true
                        }
                    }
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    
    return likes.map((like) => like.post);
}