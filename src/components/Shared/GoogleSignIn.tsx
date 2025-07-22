"use client";
import { signIn } from "next-auth/react";
import Button from "../Button/Button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInProps {
    buttonText: string;
    onClick?: () => void;
}

const GoogleSignIn = ({ buttonText, onClick }: GoogleSignInProps) => {
    return (
        <div className="relative flex items-center" onClick={() => { signIn("google"); onClick?.() }}>
              <Button variant="white" styles="w-72">{buttonText}</Button>
              <FcGoogle className="absolute left-7" size={22} />
        </div>
    );
}

export default GoogleSignIn;