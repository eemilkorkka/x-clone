import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";
import { allowedPaths } from "@/lib/paths";

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const session = await getSession();

    const isAllowedPath = allowedPaths.some((pattern) =>
        typeof pattern === "string" ? pattern === path : pattern.test(path)
    );

    if (!session && !isAllowedPath) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (session && (!session.user.username || !session.user.displayUsername)) {
        return NextResponse.redirect(new URL("/signup/setup", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)"
}