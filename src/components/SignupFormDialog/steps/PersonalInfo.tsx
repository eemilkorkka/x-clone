"use client";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import FormError from "@/components/FormError";
import Dropdown from "@/components/Dropdown";
import { dropdownFields } from "../../../utils/birthDateDropdowns";
import { useDebounce } from "@/hooks/useDebounce";

interface PersonalInfoProps {
    formData: formDataType;
    formInvalid: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const PersonalInfo = ({ formData, formInvalid, onChange, setFormInvalid }: PersonalInfoProps) => {

    const { name, email, birthDateMonth, birthDateDay, birthDateYear } = formData;

    const [fieldsAreEmpty, setFieldsAreEmpty] = useState<boolean>(true);
    const [emailMatchesPattern, setEmailMatchesPattern] = useState<boolean | undefined>(undefined);
    const [isValidEmail, setIsValidEmail] = useState<boolean | undefined>(undefined);
    const [errorText, setErrorText] = useState<string>("");
    
    const debouncedEmail = useDebounce(email, 300);
    
    console.log(formInvalid);

    useEffect(() => {
        setFieldsAreEmpty(!name || !email || !birthDateMonth || !birthDateDay || !birthDateYear);
    }, [name, email, birthDateMonth, birthDateDay, birthDateYear, setFormInvalid]);
    
    useEffect(() => {
        const validateEmail = async () => {
            if (!debouncedEmail) {
                setEmailMatchesPattern(undefined);
                setIsValidEmail(undefined);
                setErrorText("");
                setFormInvalid(true);
                return;
            }

            const matchesPattern = debouncedEmail.match(emailPattern);
            setEmailMatchesPattern(!!matchesPattern);

            if (!matchesPattern) {
                setErrorText("Please enter a valid email address");
                setFormInvalid(true);
                return;
            }

            try {
                const response = await fetch(`/api/users/email/${encodeURIComponent(debouncedEmail)}`);
                const data = await response.json();

                if (response.status === 200) {
                    setIsValidEmail(false);
                    setErrorText(data.message);
                    setFormInvalid(true);
                } else if (response.status === 404) {
                    setIsValidEmail(true);
                    setErrorText("");
                    setFormInvalid(fieldsAreEmpty);
                }
            } catch (error) {
                setIsValidEmail(false);
                setErrorText("Error checking email availability");
                setFormInvalid(true);
            }
        };

        validateEmail();
    }, [debouncedEmail, setFormInvalid, fieldsAreEmpty]);

    return (
        <>
            <FormInput type="text" name="name" label="Name" formData={formData} onChange={onChange} />
            <div className="mt-7">
                <FormInput 
                    type="email"
                    name="email" 
                    label="Email"
                    formData={formData}  
                    onChange={(e) => { onChange(e); setFormInvalid(true); }} 
                    isValid={emailMatchesPattern && isValidEmail}
                />
                <FormError text={errorText} />
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
                                    formData={formData}
                                    onChange={onChange}
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