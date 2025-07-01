import { auth } from "@/auth";
import { getTweetsWithMediaByUsername } from "@/utils/tweet/tweetUtils";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const username = req.nextUrl.searchParams.get("username") || "";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

    try {
        const tweetsWithMedia = await getTweetsWithMediaByUsername(page, limit, username);
        return NextResponse.json(tweetsWithMedia, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error.", error: error }, { status: 500 });
    }   
}