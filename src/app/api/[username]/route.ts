import { NextResponse } from "next/server";
import { getTweetsByUsername } from "@/utils/tweet/tweetUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    try {
        const posts = await getTweetsByUsername(username, page, limit);
        return NextResponse.json(posts, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}