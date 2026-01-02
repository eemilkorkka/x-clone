import { getUserByUsernameOrEmail } from "@/lib/queries/user-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username_or_email: string }> }) {
    const { username_or_email } = await params;

    try {
        const user = await getUserByUsernameOrEmail(username_or_email);

        if (!user) {
            return NextResponse.json({ message: "Couldn't find the account." }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}