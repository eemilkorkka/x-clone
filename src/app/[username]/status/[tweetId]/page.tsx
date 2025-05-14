import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Tweet from "@/components/home/Tweet/Tweet";
import TweetBox from "@/components/home/TweetBox/TweetBox";

export default async function Page({ params }: { params: Promise<{ username: string, tweetId: string }> }) {
    const { username, tweetId } = await params;

    const tweet = await prisma.posts.findFirst({
        where: {
            ID: parseInt(tweetId)
        },
        include: {
            users: {
                select: {
                    DisplayName: true,
                    ProfilePicture: true,
                }
            },
            files: true,
            likes: true,
        }
    });
    
    function item(value: string, index: number, array: string[]): unknown {
        throw new Error("Function not implemented.");
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="flex items-center gap-7 p-4 sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
                    <Link className="rounded-full h-fit p-2 hover:bg-gray-200 hover:cursor-pointer" href="/home">
                        <FaArrowLeft size={18} />
                    </Link>
                    <span className="font-bold text-xl">Post</span>
                </div>
                {tweet && (
                    <Tweet 
                        tweetType="status"
                        tweetContent={
                            { 
                                text: tweet.Content,
                                files: tweet.files.map((file: { File_URL: string; File_Type: string }) => ({
                                    url: file.File_URL,
                                    type: file.File_Type
                                }))
                            }
                        }
                        tweetId={parseInt(tweetId)}
                        profilePicture={tweet.users.ProfilePicture}
                        displayName={tweet.users.DisplayName}
                        username={username}
                        timeStamp={tweet.created_at!}
                        statValues={[0, 0, tweet.likes.length]}
                        likes={tweet.likes}
                    />
                )}
                <TweetBox type="reply" />
            </Layout>
        </ProtectedRoute>
    );
}