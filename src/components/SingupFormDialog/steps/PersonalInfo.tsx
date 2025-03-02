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
            <div className="flex flex-col gap-1 mt-10">
                <span className="font-bold">Date of birth</span>
                <p className="text-gray-500 text-[0.9em]">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                <div className="flex">
                </div>
            </div>

        </>
    );
}

export default PersonalInfo;