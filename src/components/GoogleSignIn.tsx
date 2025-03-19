import Button from "./Button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInProps {
    buttonText: string;
}

const GoogleSignIn = ({ buttonText }: GoogleSignInProps) => {
    return (
        <div className="relative">
              <Button variant="white">{buttonText}</Button>
              <FcGoogle className="absolute top-3 left-9" size={22} />
        </div>
    );
}

export default GoogleSignIn;