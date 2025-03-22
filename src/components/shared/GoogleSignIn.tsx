"use client";
import { signIn } from "next-auth/react";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInProps {
    buttonText: string;
    onClick?: () => void;
}

const GoogleSignIn = ({ buttonText, onClick }: GoogleSignInProps) => {
    
    const signInWithGoogle = async () => {
        await signIn("google");
    }

    return (
        <div className="relative" onClick={() => { signInWithGoogle(); onClick }}>
              <Button variant="white" style="w-72">{buttonText}</Button>
              <FcGoogle className="absolute top-3 left-9" size={22} />
        </div>
    );
}

export default GoogleSignIn;