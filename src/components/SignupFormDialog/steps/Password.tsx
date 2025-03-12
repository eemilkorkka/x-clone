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

    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        setFormInvalid(true);
        console.log(formData.password === formData.confirmPassword);
    }, [formData.password, formData.confirmPassword])
    
    return (
        <>
            <FormInput 
                type="password"
                name="password"
                label="Password"
                formData={formData}
                onChange={(e) => onChange(e)}
            />
            <div className="mt-7">
                <FormInput 
                    type="password"
                    name="confirmPassword"
                    label="Confirm password"
                    formData={formData}
                    onChange={(e) => onChange(e)}
                />
            </div>
            <FormError text={errorText} />
        </>
    );
}

export default Password;