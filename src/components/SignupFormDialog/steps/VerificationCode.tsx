"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormError from "@/components/FormError";
import { sendVerificationEmail } from "@/utils/utilFunctions";
import { useDebounce } from "@/hooks/useDebounce";

interface VerificationCodeProps {
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    setFormData: Dispatch<SetStateAction<formDataType>>;
}

const VerificationCode = ({ formData, onChange, setFormInvalid, setFormData }: VerificationCodeProps) => {

    const [codeIsValid, setCodeIsValid] = useState<boolean | undefined>(undefined);
    const [errorText, setErrorText] = useState<string>("");
    const { verificationCode } = formData;
    const debouncedVerificationCode = useDebounce(verificationCode, 500);
    
    useEffect(() => {
        if (!verificationCode) {
            setCodeIsValid(undefined);
            setErrorText("");
            setFormInvalid(true);
        }
    }, [verificationCode]);

    useEffect(() => {  
        
        if (debouncedVerificationCode.length < 6) {
            setErrorText("");
            setFormInvalid(true);
            return;
        }

        const verifyCode = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/verify/code", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: formData.email, verificationCode: debouncedVerificationCode })
                });
    
                const result = await response.json();
    
                if (response.status == 200) {
                    setFormInvalid(false);
                    setCodeIsValid(true);
                    setErrorText("");
                } else {
                    setFormInvalid(true);
                    setCodeIsValid(false);
                    setErrorText(result.message);
                }
            } catch (error) {
                setCodeIsValid(false);
                setErrorText("An error occurred. Please try again.");
            }
        }

        verifyCode();
    }, [debouncedVerificationCode])

    const handleResendCode = () => {
        sendVerificationEmail(formData.email, formData.name);
        setFormData(prev => ({
            ...prev,
            verificationCode: ""
        }));
    }

    return (
        <>
            <p className="text-gray-500 mb-5">Enter it below to verify {formData.email}</p>
            <FormInput 
                type="text" 
                name="verificationCode" 
                label="Verification code" 
                formData={formData} 
                onChange={onChange} 
                isValid={codeIsValid} 
            />
            { errorText != "" && <FormError text={errorText} /> }
            <p 
                className="text-gray-500 mt-3">Didn't receive code?
                <span 
                    className="text-xblue hover:cursor-pointer" 
                    onClick={handleResendCode}
                    > Resend code
                </span>
            </p>
        </>
    );
}

export default VerificationCode;