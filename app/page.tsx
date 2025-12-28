import { Button } from "@/components/ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/Separator";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex p-8 flex-col sm:items-center md:flex-row min-h-screen bg-black">
            <div className="flex flex-col md:flex-row md:w-full">
                <div className="flex w-full h-fit md:m-auto p-4 md:p-8 md:max-w-1/2 md:pr-8">
                    <FaXTwitter className="w-full h-full max-h-15 max-w-15 md:max-h-90 md:max-w-full " fill="white" />
                </div>
                <div className="flex flex-col md:justify-center flex-1 p-4">
                    <div className="w-full space-y-8">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white sm:whitespace-nowrap">Happening now</h1>
                        <h3 className="text-3xl font-extrabold text-white">Join today.</h3>
                    </div>
                    <div className="mt-8 space-y-4 max-w-xs">
                        <Button size="lg" variant="secondary" className="rounded-full w-full py-5.5 hover:cursor-pointer">
                            <div className="flex items-center gap-3">
                                <FcGoogle className="" size={25} />
                                <span>Sign up with Google</span>
                            </div>
                        </Button>
                        <Separator text="OR" />
                        <Button size="lg" variant="secondary" className="rounded-full w-full font-bold py-5.5 hover:cursor-pointer">
                            Create account
                        </Button>
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
                            <Button size="lg" className="bg-transparent border-1 border-zinc-500 rounded-full w-full font-bold py-5.5 hover:cursor-pointer">
                                Sign in
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}