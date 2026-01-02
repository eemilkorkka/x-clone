import { getTweetById } from "@/lib/queries/tweet-queries";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    try {
        const tweet = await getTweetById(parseInt(id));

        if (!tweet) {
            return NextResponse.json({ message: "Couldn't find tweet." }, { status: 404 });
        }

        return NextResponse.json(tweet , { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}