import Image from "next/image";
import logo from "../assets/logo-white.png";
import Button from "@/components/Button";
import { FcGoogle } from "react-icons/fc";
import SignupFormDialog from "@/components/SignupFormDialog/SignupFormDialog";
import SignupFormContextProvider from "@/context/signupFormContext";

export default function Root() {
  return (
    <div className="flex w-full h-full justify-center">
      <div className="flex lg:w-full lg:items-center justify-center flex-col lg:flex-row p-4 lg:p-0">
        <div className="w-1/2 flex items-start justify-start lg:items-center lg:justify-center">
          <Image src={logo} alt="logo" width={0} height={0} className="w-12 lg:w-[400px]" />
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold lg:whitespace-nowrap mt-15 lg:mt-0 p-3">Happening now</h1>
          <h2 className="text-3xl font-bold mt-15">Join today.</h2>
          <div className="flex flex-col mt-10 gap-2.5">
            <div className="relative">
              <Button variant="white">Sign up with Google</Button>
              <FcGoogle className="absolute top-3 left-9" size={22} />
            </div>
            <div className="flex items-center gap-3">
              <hr className="h-1 w-31 text-gray-600"></hr>
              <span>or</span>
              <hr className="h-1 w-31 text-gray-600"></hr>
            </div>
            <div>
              <SignupFormContextProvider>
                <SignupFormDialog>
                  <Button>Create account</Button>
                </SignupFormDialog>
              </SignupFormContextProvider>
            </div>
          </div>
          <div className="mt-15 flex flex-col">
            <span className="font-bold">Already have an account?</span>
            <div className="mt-5">
              <Button variant="outline">Sign in</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
