import Image from "next/image";
import logo from "../assets/logo-white.png";
import Button from "@/components/Shared/Button";
import SignupFormDialog from "@/components/SignupFormDialog/SignupFormDialog";
import SignupFormContextProvider from "@/Context/SignupFormContext";
import SignInFormDialog from "@/components/SignInFormDialog/SignInFormDialog";
import GoogleSignIn from "@/components/Shared/GoogleSignIn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Root() {
  const session = await auth();
  if (session?.user) return redirect("/home");

  return (
    <div className="flex w-full h-full bg-black text-white justify-center">
      <div className="flex lg:w-full lg:items-center justify-center flex-col lg:flex-row p-4 lg:p-0">
        <div className="w-1/2 flex items-start justify-start lg:items-center lg:justify-center">
          <Image src={logo} alt="logo" width={0} height={0} className="w-12 lg:w-[400px]" loading={"eager"} />
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold lg:whitespace-nowrap mt-15 lg:mt-0 p-3">Happening now</h1>
          <h2 className="text-3xl font-bold mt-15">Join today.</h2>
          <div className="flex flex-col mt-10 gap-2.5">
            <GoogleSignIn buttonText="Sign up with Google" />
            <div className="flex items-center gap-3">
              <hr className="h-1 w-31 text-gray-600"></hr>
              <span>or</span>
              <hr className="h-1 w-31 text-gray-600"></hr>
            </div>
            <div>
              <SignupFormContextProvider>
                <SignupFormDialog>
                  <Button style="w-72">Create account</Button>
                </SignupFormDialog>
              </SignupFormContextProvider>
            </div>
          </div>
          <div className="mt-15 flex flex-col">
            <span className="font-bold">Already have an account?</span>
            <div className="mt-5">
              <SignInFormDialog>
                <Button variant="outline" hoverColor="blue" style="w-72">Sign in</Button>
              </SignInFormDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
