import { auth } from "@/auth";
import { getReplies, getTweetsAndRepliesByUsername } from "@/utils/tweet/tweetUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;

    const tweetId = parseInt(searchParams.get("tweetId") ?? "");
    const username = searchParams.get("username");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    try {
        if (tweetId) {
            const replies = await getReplies(tweetId, page, limit);
            return NextResponse.json(replies, { status: 200 });
        } else if (username) {
            const replies = await getTweetsAndRepliesByUsername(username, page, limit);
            return NextResponse.json(replies, { status: 200 });
        } else {
            return NextResponse.json({ message: "No tweet ID or username was provided" }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}