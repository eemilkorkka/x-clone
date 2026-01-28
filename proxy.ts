import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const session = await getSession(); 
    
    if (!session && path !== "/" && path !== "/signup") {
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