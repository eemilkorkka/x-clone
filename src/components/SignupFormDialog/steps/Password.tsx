import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormError from "@/components/FormError";

interface PasswordProps {
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const Password = ({ formData, onChange, setFormInvalid }: PasswordProps) => {

    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false); 
    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        setFormInvalid(true);
        
        if (formData.password != "") {
            if (formData.password === formData.confirmPassword) {
                setErrorText(validatePassword(formData.password));
            }
            else {
                setErrorText("Passwords do not match!");
                setIsPasswordValid(false);
            }
        }

    }, [formData.password, formData.confirmPassword])

    const validatePassword = (password: string): string => {
        var regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!regex.test(password)) {
            setIsPasswordValid(false);
            return "Password should at least be 8 characters long and contain one special symbol, upper and lowercase letters and a number.";
        } else {
            setIsPasswordValid(true);
            setFormInvalid(false);
            return "";
        }
    }

    return (
        <>
            <FormInput 
                type="password"
                name="password"
                label="Password"
                formData={formData}
                onChange={(e) => onChange(e)}
                isValid={isPasswordValid}
            />
            <div className="mt-7">
                <FormInput 
                    type="password"
                    name="confirmPassword"
                    label="Confirm password"
                    formData={formData}
                    onChange={(e) => onChange(e)}
                    isValid={isPasswordValid}
                />
            </div>
            <FormError text={errorText} />
        </>
    );
}

export default Password;