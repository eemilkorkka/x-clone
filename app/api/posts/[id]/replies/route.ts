import { getRepliesByTweetId } from "@/lib/queries/tweet-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }>} ) {
    const { id } = await params;

    const searchParams = request.nextUrl.searchParams;

    const cursorCreatedAt = searchParams.get("cursorCreatedAt");
    const cursorId = searchParams.get("cursorId");

    const cursor = cursorCreatedAt && cursorId ? { createdAt: new Date(cursorCreatedAt), id: Number(cursorId) } : undefined;

    try {
        const result = await getRepliesByTweetId(parseInt(id), cursor);

        if (!result) {
            return NextResponse.json({ message: "Couldn't find tweets." }, { status: 404 });
        }

        const nextCursor = result.nextCursor ? {
            createdAt: result.nextCursor.createdAt.toISOString(),
            id: result.nextCursor.id
        } : null;

        return NextResponse.json({
            items: result.items,
            nextCursor
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}