"use client";
import { signIn } from "next-auth/react";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInProps {
    buttonText: string;
}

const GoogleSignIn = ({ buttonText }: GoogleSignInProps) => {
    
    const signInWithGoogle = async () => {
        await signIn("google");
    }

    return (
        <div className="relative" onClick={signInWithGoogle}>
              <Button variant="white">{buttonText}</Button>
              <FcGoogle className="absolute top-3 left-9" size={22} />
        </div>
    );
}

export default GoogleSignIn;