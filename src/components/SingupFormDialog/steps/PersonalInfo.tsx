"use client";
import { ChangeEvent, useEffect, useState } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import FormError from "@/components/FormError";

interface PersonalInfoProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    formData: formDataType;
}

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const PersonalInfo = ({ onChange, formData }: PersonalInfoProps) => {

    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const { email } = formData;

    useEffect(() => {
        const validateEmail = () => {
            email.match(emailPattern) ? setIsValidEmail(true) : setIsValidEmail(false);
        }
        validateEmail();
    }, [email])

    return (
        <>
            <FormInput type="text" name="name" label="Name" onChange={(e) =>  onChange(e)}></FormInput>
            <FormInput type="email" name="email" label="Email" isValid={isValidEmail} style={{marginTop: "30px" }} onChange={(e) => onChange(e)}></FormInput>
            {!isValidEmail && email != "" && <FormError text="Email is invalid. Please enter a valid email address." />}
        </>
    );
}

export default PersonalInfo;