import { getUsersByUsernameOrDisplayname } from "@/lib/queries/user-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username_or_displayname = searchParams.get("username_or_displayname") as string;

    if (!username_or_displayname) {
        return NextResponse.json({ error: "Missing required parameter." }, { status: 400 });
    }

    try {
        const users = await getUsersByUsernameOrDisplayname(username_or_displayname);

        if (!users) {
            return NextResponse.json({ error: "No users found." }, { status: 404 });
        }

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}