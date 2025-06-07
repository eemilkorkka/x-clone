import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import FeedHeader from "@/components/Shared/FeedHeader";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Tweet from "@/components/Tweet/Tweet";

export default async function Page() {
    const session = await auth();

    const bookmarks = await prisma.posts.findMany({
        where: {
            bookmarks: {
                some: {
                    UserID: parseInt(session?.user.id!)
                }
            }
        },
        include: {
            users: {
                select: {
                    Username: true,
                    DisplayName: true,
                    ProfilePicture: true,
                }
            },
            files: true,
            likes: true,
            replies: true,
            bookmarks: true
        },
        orderBy: {
            created_at: "desc"
        }
    });

    return (
        <ProtectedRoute>
            <Layout>
                <FeedHeader title="Bookmarks" />
                {bookmarks.length > 0 ? (
                    <div>
                        {bookmarks.map((tweet) => {
                            return (
                                <Tweet 
                                    key={tweet.ID}
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
                                    timeStamp={new Date(tweet.created_at!)}
                                    statValues={[tweet.replies.length, 0, tweet.likes.length]}
                                    likes={tweet.likes}
                                    bookmarks={tweet.bookmarks}
                                />
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full p-20">
                        <div>
                            <span className="font-extrabold text-3xl">Save posts for later</span>
                            <p className="text-gray-500">Bookmark posts to easily find them again in the <br/> future.</p>
                        </div>
                    </div>
                )}
            </Layout>
        </ProtectedRoute>
    );
}