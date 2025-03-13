"use client";
import { ChangeEvent, Dispatch, HTMLInputTypeAttribute, SetStateAction, useEffect, useState } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import FormError from "@/components/FormError";
import { IoIosArrowDown } from "react-icons/io";
import Dropdown from "@/components/Dropdown";

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

    console.log(formData);

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
        if (name === "" || email === "" || !isValidEmail || birthDateMonth === "" || birthDateDay == "" || birthDateYear == "") {
            setFormInvalid(true);
        }
        else {
            setFormInvalid(false);
        }
    }, [name, email, birthDateMonth, birthDateDay, birthDateYear, isValidEmail])

    const dropdownFields = [
        {
            name: "birthDateMonth",
            data: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            label: "Month",
            style: "flex-1 sm:flex-2"
        },
        {
            name: "birthDateDay",
            data: Array.from({length: 31}, (_, i) => i + 1).map(String),
            label: "Day",
            style: "flex-1 sm:flex-1"
        },
        {
            name: "birthDateYear",
            data: Array.from({ length: 81 }, (_, i) => new Date().getFullYear() - i).map(String),
            label: "Year",
            style: "flex-1 sm:flex-1"
        }
    ];

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
                { /* TODO: Need to make the icon fill blue as well when the input is focused */ }
                    {dropdownFields.map((dropdownField, index) => {
                        return (
                            <div key={index} className={`relative ${dropdownField.style}`}>
                                <Dropdown 
                                    name={dropdownField.name}
                                    data={dropdownField.data}
                                    label={dropdownField.label}
                                    onChange={(e) => onChange(e)}
                                />
                                <IoIosArrowDown className="absolute top-4.5 right-3" size={20} fill={"gray"} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default PersonalInfo;