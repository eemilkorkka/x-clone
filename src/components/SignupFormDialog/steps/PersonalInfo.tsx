"use client";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import FormError from "@/components/FormError";
import Dropdown from "@/components/Dropdown";
import { dropdownFields } from "../../../utils/birthDateDropdowns";

interface PersonalInfoProps {
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    formData: formDataType;
    setFormData: Dispatch<SetStateAction<formDataType>>;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const PersonalInfo = ({ onChange, formData, setFormData, setFormInvalid }: PersonalInfoProps) => {

    const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
    const [errorText, setErrorText] = useState<string>("");

    const { name, email, birthDateMonth, birthDateDay, birthDateYear } = formData;

    useEffect(() => {
        const validateEmail: () => Promise<void> = async () => {
            if (email.match(emailPattern)) {
                setIsValidEmail(true);

                // Let's check if the email already exists or not.
                const response = await fetch(`http://localhost:3000/api/users/email/${email}`, {
                    method: "GET"
                });

                const result = await response.json();
                
                if (response.status == 200) {
                    setIsValidEmail(false);
                    setErrorText(result.message);
                }
                else {
                    setIsValidEmail(true);
                    setErrorText("");
                }
            }
            else {
                setIsValidEmail(false);
                setErrorText("Email is invalid. Please enter a valid email address.");
            }
        }
        validateEmail();
    }, [email])

    useEffect(() => {
        const isFormValid = name === "" || email === "" || !isValidEmail || birthDateMonth === "" || birthDateDay == "" || birthDateYear == "";
    }, [name, email, birthDateMonth, birthDateDay, birthDateYear, isValidEmail])

    return (
        <>
            <FormInput type="text" name="name" label="Name" formData={formData} onChange={(e) => onChange(e)} />
            <div className="mt-7">
                <FormInput 
                    type="email"
                    name="email" 
                    label="Email"
                    formData={formData} 
                    isValid={isValidEmail}  
                    onChange={(e) => onChange(e)} 
                />
                {!isValidEmail && email != "" && <FormError text={errorText} />}
            </div>
            <div className="flex flex-col gap-1 mt-10">
                <span className="font-bold">Date of birth</span>
                <p className="text-gray-500 text-[0.9em]">This will not be shown publicly. Confirm your own age, 
                    even if this account is for a business, a pet, or something else.</p>
                <div className="flex gap-3 mt-2.5">
                    {dropdownFields.map((dropdownField, index) => {
                        return (
                            <div key={index} className={dropdownField.style}>
                                <Dropdown 
                                    name={dropdownField.name}
                                    data={dropdownField.data}
                                    label={dropdownField.label}
                                    onChange={(e) => onChange(e)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default PersonalInfo;