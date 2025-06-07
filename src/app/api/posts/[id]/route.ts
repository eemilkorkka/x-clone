import { getTweetById } from "@/utils/tweet/tweetUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const tweet = await getTweetById(parseInt(id));

    return tweet ? NextResponse.json(tweet, { status: 200 })
    : NextResponse.json({ message: "Tweet not found." }, { status: 404 });
}