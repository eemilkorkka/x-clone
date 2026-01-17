import { getFollowersByUsername } from "@/lib/queries/user-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ username_or_email: string }> }) {

    const { username_or_email } = await params;

    if (username_or_email.includes("@") || !username_or_email) {
        return NextResponse.json({ messasge: "Missing parameters or invalid parameters." }, { status: 400 });
    }
    
    const searchParams = request.nextUrl.searchParams;

    const cursorCreatedAt = searchParams.get("cursorCreatedAt");
    const cursorId = searchParams.get("cursorId");

    const cursor = cursorCreatedAt && cursorId ? { createdAt: new Date(cursorCreatedAt), id: cursorId } : undefined;

    try {
        const result = await getFollowersByUsername(username_or_email, cursor);

        if (!result) {
            return NextResponse.json({ message: "Followers not found." }, { status: 404 });
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
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}