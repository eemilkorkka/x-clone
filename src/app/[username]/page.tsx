import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Profile from "@/components/Profile/Profile";
import { prisma } from "@/lib/prisma";
import Tweet from "@/components/Tweet/Tweet";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

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
            }
        },
        orderBy: {
            created_at: "desc",
        },
    });

    return (
        <ProtectedRoute>
            <Layout>
                <Profile username={username}>
                    {tweets.map((tweet) => {
                        return (
                            <Tweet
                                tweetType="tweet" 
                                key={tweet.ID}
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
                                statValues={[0,0, tweet.likes.length]}
                                likes={tweet.likes}
                            />
                        );
                    })}
                </Profile>
            </Layout>
        </ProtectedRoute>
    );
}
