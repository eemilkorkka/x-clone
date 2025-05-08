import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { username: string } }) {
    const { username } = params;
    
    try {
        const posts = await prisma.posts.findMany({
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
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}