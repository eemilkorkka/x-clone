import { getAllTweets } from "@/lib/queries/tweet-queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    try {
        const tweets = await getAllTweets();

        if (!tweets) {
            return NextResponse.json({ message: "Couldn't find tweets." }, { status: 404 });
        }

        return NextResponse.json({ tweets }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}