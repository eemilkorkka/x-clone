"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

interface VerificationCodeProps {
    email: string;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const VerificationCode = ({ email, formData, onChange, setFormInvalid }: VerificationCodeProps) => {

    const { verificationCode } = formData;

    useEffect(() => {
        verificationCode === "" ? setFormInvalid(true) : setFormInvalid(false);
    }, [verificationCode])

    return (
        <>
            <p className="text-gray-500 mb-5">Enter it below to verify {email}.</p>
            <FormInput type="text" name="verificationCode" label="Verification code" formData={formData} onChange={(e) => onChange(e)} />
        </>
    );
}

export default VerificationCode;