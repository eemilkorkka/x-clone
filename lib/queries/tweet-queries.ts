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
                    pinnedTweetId: true,
                    followers: {
                        select: {
                            followerId: true
                        }
                    },
                    following: {
                        select: {
                            followingId: true
                        }
                    },
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
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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

export const getTweetsFromFollowing = async (userId: string, cursor?: { createdAt: Date; id: number }) => {
    const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
    });

    const followIds = follows.map(follower => follower.followingId);

    const tweets = await prisma.tweet.findMany({
        where: {
            parentTweetId: null,
            user: {
                id: { in: followIds }
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    image: true,
                    followers: {
                        select: {
                            followerId: true
                        }
                    },
                    following: {
                        select: {
                            followingId: true
                        }
                    },
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
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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

export const getTweetsByUser = async (username: string, includeReplies: boolean, cursor?: { createdAt: Date; id: number }) => {

    const user = await prisma.user.findUnique({
        where: { username },
        select: { pinnedTweetId: true },
    });

    const tweets = await prisma.tweet.findMany({
        where: {
            parentTweetId: includeReplies ? undefined : null,
            user: {
                username: username
            },
            ...(user?.pinnedTweetId ? { id: { not: user.pinnedTweetId } } : {})
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    image: true,
                    pinnedTweetId: true,
                    followers: {
                        select: {
                            followerId: true
                        }
                    },
                    following: {
                        select: {
                            followingId: true
                        }
                    },
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
            parentTweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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

export const getTweetsByUserWithMedia = async (username: string, cursor?: { createdAt: Date; id: number }) => {
    const tweets = await prisma.tweet.findMany({
        where: {
            user: {
                username: username
            },
            files: {
                some: {}
            }
        },
        include: {
            files: true,
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

export const getLikesByUser = async (username: string, cursor?: { createdAt: Date; id: number }) => {
    const likes = await prisma.like.findMany({
        where: {
            user: {
                username: username
            }
        },
        include: {
            tweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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
                                    pinnedTweetId: true,
                                    followers: {
                                        select: {
                                            followerId: true
                                        }
                                    },
                                    following: {
                                        select: {
                                            followingId: true
                                        }
                                    },
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

    const last = likes[likes.length - 1];

    return {
        items: likes.map(like => like.tweet),
        nextCursor: last ? { createdAt: last.createdAt, id: last.id } : null,
    };
}

export const getBookmarksByUser = async (username: string, cursor?: { createdAt: Date; id: number }) => {
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            user: {
                username: username
            }
        },
        include: {
            tweet: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayUsername: true,
                            image: true,
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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
                                    pinnedTweetId: true,
                                    followers: {
                                        select: {
                                            followerId: true
                                        }
                                    },
                                    following: {
                                        select: {
                                            followingId: true
                                        }
                                    },
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

    const last = bookmarks[bookmarks.length - 1];
    return {
        items: bookmarks.map(bookmark => bookmark.tweet),
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
                    pinnedTweetId: true,
                    followers: {
                        select: {
                            followerId: true
                        }
                    },
                    following: {
                        select: {
                            followingId: true
                        }
                    },
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
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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
                    pinnedTweetId: true,
                    followers: {
                        select: {
                            followerId: true
                        }
                    },
                    following: {
                        select: {
                            followingId: true
                        }
                    },
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
                            pinnedTweetId: true,
                            followers: {
                                select: {
                                    followerId: true
                                }
                            },
                            following: {
                                select: {
                                    followingId: true
                                }
                            },
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
        }
    });
}


