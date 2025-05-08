import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const { text, userID, files } = await req.json();

    try {
        const post = await prisma.posts.create({
            data: {
                UserID: userID,
                Content: text,
            }
        });

        if (!post) return NextResponse.json({ message: "Something went wrong." }, { status: 500 });

        if (files && files.length > 0) {
            await prisma.files.createMany({
                data: files.map((file: { url: string; type: string; }) => ({
                    PostID: post.ID,
                    File_URL: file.url,
                    File_Type: file.type.split("/")[0],
                })),
            });
        }

        const createdPost = await prisma.posts.findFirst({
            include: {
                users: {
                    select: {
                        Username: true,
                        DisplayName: true,
                        ProfilePicture: true,
                    },
                },
                files: true,
            },
            orderBy: {
                created_at: "desc"
            }
        });
        
        return NextResponse.json({ message: "Post created successfully.", post: createdPost }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error. " }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const posts = await prisma.posts.findMany({
            include: {
                users: {
                    select: {
                        Username: true,
                        DisplayName: true,
                        ProfilePicture: true,
                    },
                },
                files: true,
            },
            orderBy: {
                created_at: "desc"
            }
        });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error. " }, { status: 500 });
    }
}