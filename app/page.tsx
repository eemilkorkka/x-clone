import { Button } from "@/components/ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { Separator } from "@/components/ui/seperator-with-text";
import { Footer } from "@/components/Footer";
import { GoogleSignup } from "@/components/auth/GoogleSignup";
import { SignInDialog } from "@/components/auth/Forms/SignInForm/SignInDialog";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function IndexPage() {

    const session = await getSession();

    if (session) {
        redirect("/home");
    }

    return (
        <div className="flex flex-col p-6 sm:items-center min-h-screen bg-black">
            <div className="lg:mt-auto flex flex-col lg:flex-row lg:w-full">
                <div className="flex w-full h-fit lg:m-auto p-4 lg:p-8 lg:max-w-1/2 lg:pr-8">
                    <FaXTwitter className="w-full h-full max-h-11 max-w-11 lg:max-h-90 lg:max-w-full " fill="white" />
                </div>
                <div className="flex flex-col lg:justify-center flex-1 p-4">
                    <div className="w-full space-y-8">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white sm:whitespace-nowrap">Happening now</h1>
                        <h3 className="text-3xl font-extrabold text-white">Join today.</h3>
                    </div>
                    <div className="mt-8 space-y-4 max-w-xs">
                        <GoogleSignup />
                        <Separator />
                        <Link href="/signup">
                            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full w-full font-bold py-5.5 hover:cursor-pointer">
                                Create account
                            </Button>
                        </Link>
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
                    </div>
                    <div className="max-w-xs">
                        <p className="text-lg mt-20 font-bold text-white">Already have an account?</p>
                        <div className="mt-4 mb-8">
                            <SignInDialog />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}