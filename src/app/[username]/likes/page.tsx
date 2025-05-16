import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Profile from "@/components/Profile/Profile";
import { prisma } from "@/lib/prisma";
import Tweet from "@/components/Tweet/Tweet";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const userId = await prisma.users.findUnique({
        where: {
            Username: username
        },
        select: {
            UserID: true
        }
    });

    const likes = await prisma.likes.findMany({
        where: {
            UserID: userId?.UserID,
        },
        orderBy: {
            created_at: 'desc',
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
                },
            },
        },
    });


    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username} likesCount={likes.length}>
                    {likes.map((like, index) => {
                        const tweet = like.post;
                        return (
                            <Tweet
                                key={index}
                                tweetType="tweet"
                                tweetId={tweet.ID}
                                username={tweet.users.Username}
                                displayName={tweet.users.DisplayName}
                                profilePicture={tweet.users.ProfilePicture}
                                tweetContent={
                                    {
                                        text: tweet.Content,
                                        files: tweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                            url: file.File_URL,
                                            type: file.File_Type
                                        }))
                                    }
                                }
                                timeStamp={tweet.created_at!}
                                statValues={[0, 0, tweet.likes.length]}
                                likes={tweet.likes}
                            />
                        );
                    })}
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}