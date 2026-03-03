"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "./ui/button";
import { useColor } from "@/context/ColorContext";
import { authClient } from "@/lib/auth-client";
import { GoogleSignup } from "./auth/GoogleSignup";
import Link from "next/link";

export const PremiumCard = () => {

    const { colors } = useColor();
    const { data } = authClient.useSession();

    if (!data) return (
        <Card className="py-4 shadow-none bg-background border-1 border-foreground/10 ring-0 gap-2">
            <CardHeader className="px-4">
                <CardTitle className="font-bold text-xl">New to X Clone?</CardTitle>
                <CardDescription>Sign up now to get your own personalized timeline!</CardDescription>
            </CardHeader>
            <CardContent className="px-4 space-y-2">
                <GoogleSignup styles="py-5" />
                <Link href="/signup">
                    <Button className="rounded-full w-full py-5 bg-white text-black font-bold hover:cursor-pointer">Create account</Button>
                </Link>
            </CardContent>
            <CardFooter className="px-4">
                <p className="text-xs text-zinc-500 mt-2">By signing up you agree to the
                    <span className="text-sky-500 hover:underline">
                        {' '}
                        Terms of Service
                        {' '}
                    </span>
                    and
                    <span className="text-sky-500 hover:underline">
                        {' '}
                        Privacy Policy
                    </span>
                    , including
                    <span className="text-sky-500 hover:underline">
                        {' '}
                        Cookie Use.
                    </span>
                </p>
            </CardFooter>
        </Card>
    )

    return (
        <Card className="py-4 shadow-none bg-background border-1 border-foreground/10 ring-0 gap-2">
            <CardHeader className="px-4">
                <CardTitle className="font-bold text-xl">Subscribe to Premium</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
                <p>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
            </CardContent>
            <CardFooter className="px-4">
                <Button className={`rounded-full px-4 font-bold text-white ${colors.color} ${colors.hoverColor} hover:cursor-pointer`}>Subscribe</Button>
            </CardFooter>
        </Card>
    )
}