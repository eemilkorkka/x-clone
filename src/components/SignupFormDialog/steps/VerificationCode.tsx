"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { sendVerificationEmail } from "@/utils/utilFunctions";
import { z } from "zod";
import { useFormValidation } from "@/hooks/useFormValidation";
import { verificationCodeSchema } from "@/lib/schemas";

interface VerificationCodeProps {
    formData: formDataType;
    touchedFields: string[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    setFormData: Dispatch<SetStateAction<formDataType>>;
}

type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

const VerificationCode = ({ formData, touchedFields, onChange, setFormInvalid, setFormData }: VerificationCodeProps) => {

    const { getErrorMessage } = useFormValidation<VerificationCodeFormData>({
            formData: formData as VerificationCodeFormData,
            schema: verificationCodeSchema,
            touchedFields: touchedFields,
            setFormInvalid
    });

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
                error={getErrorMessage("verificationCode")}
            />
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