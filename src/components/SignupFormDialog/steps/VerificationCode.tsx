"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormError from "@/components/FormError";

interface VerificationCodeProps {
    email: string;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const VerificationCode = ({ email, formData, onChange, setFormInvalid }: VerificationCodeProps) => {

    const [codeIsValid, setCodeIsValid] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const { verificationCode } = formData;

    useEffect(() => {   
        setFormInvalid(true);

        const verifyCode: () => Promise<void> = async () => {
            if (verificationCode.length == 6) {
                const response = await fetch("http://localhost:3000/api/verify/code", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: formData.email, verificationCode: formData.verificationCode })
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
            }
        }

        verifyCode();
    }, [verificationCode])

    return (
        <>
            <p className="text-gray-500 mb-5">Enter it below to verify {email}.</p>
            <FormInput 
                type="text" 
                name="verificationCode" 
                label="Verification code" 
                formData={formData} 
                onChange={(e) => onChange(e)} 
                isValid={codeIsValid} 
            />
            <FormError text={errorText} />
        </>
    );
}

export default VerificationCode;