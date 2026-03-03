import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const username_or_email = searchParams.get("username_or_email") as string;

    if (!username_or_email) {
        return NextResponse.json({ message: "Username or email is required." }, { status: 400 });
    }

    try {
        if (!username_or_email.includes("@")) {
            const user = await prisma.user.findUnique({
                where: {
                    username: username_or_email
                },
                select: { email: true }
            });

            if (!user) {
                return NextResponse.json({ message: "User not found." }, { status: 404 });
            }

            const data = await requestPasswordReset(user?.email || "");
        } else {
            const data = await requestPasswordReset(username_or_email);
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal Server Error." }, { status: 500 });
    }
}

const requestPasswordReset = async (email: string) => {
    const data = await auth.api.requestPasswordReset({
        body: {
            email: email,
            redirectTo: "/reset-password"
        },
    });

    if (!data.status) {
        return NextResponse.json({ message: data.message }, { status: 500 });
    }

    return data;
}