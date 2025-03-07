"use client";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import FormError from "@/components/FormError";
import { IoIosArrowDown } from "react-icons/io";
import MonthDropdown from "../../Dropdowns/MonthDropdown";
import DayDropdown from "@/components/Dropdowns/DayDropdown";
import YearDropdown from "@/components/Dropdowns/YearDropdown";

interface PersonalInfoProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    formData: formDataType;
    setFormData: Dispatch<SetStateAction<formDataType>>;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const PersonalInfo = ({ onChange, formData, setFormData, setFormInvalid }: PersonalInfoProps) => {

    const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
    const [errorText, setErrorText] = useState<string>("");
    const [monthDropdownVisible, setMonthDropdownVisible] = useState<boolean>(false);
    const [dayDropwdownVisible, setDayDropdownVisible] = useState<boolean>(false);
    const [yearDropdownVisible, setYearDropdownVisible] = useState<boolean>(false);

    const { name, email, birthDateMonth, birthDateDay, birthDateYear } = formData;

    useEffect(() => {
        const validateEmail = async () => {
            if (email.match(emailPattern)) {
                setIsValidEmail(true);
                
                // Let's check if the email already exists or not.
                const response = await fetch(`/api/users/email?email=${encodeURIComponent(email)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                
                if (!response.ok) {
                    return;
                }

                const result = await response.json();
                
                if (result.user) {
                    setIsValidEmail(false);
                    setErrorText("The email you entered is already in use.");
                }
                else {
                    setIsValidEmail(true);
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
                { /* TODO: Need to make the icon fill blue as well when the input is focused */ }
                {!isValidEmail && email != "" && <FormError text={errorText} />}
            </div>
            <div className="flex flex-col gap-1 mt-10">
                <span className="font-bold">Date of birth</span>
                <p className="text-gray-500 text-[0.9em]">This will not be shown publicly. Confirm your own age, 
                    even if this account is for a business, a pet, or something else.</p>
                <div className="flex gap-3 mt-2.5">
                    <div className="relative" onClick={() => setMonthDropdownVisible(true)}>
                        <FormInput 
                            type="text" 
                            parentStyle="hover:cursor-pointer"
                            labelStyle="!top-1 text-[0.8em]"
                            name="birthDateMonth" 
                            label="Month" 
                            formData={formData} 
                            onChange={(e) => onChange(e)} isReadOnly={true} 
                        />
                        <IoIosArrowDown className="absolute top-4.5 right-3 hover:cursor-pointer" size={20} fill={"gray"} />
                    </div>
                    { monthDropdownVisible && 
                        <MonthDropdown 
                            style="top-30"
                            setFormData={setFormData} 
                            setMonthDropdownVisible={setMonthDropdownVisible} 
                        /> 
                    }
                    <div className="relative md:flex-1" onClick={() => setDayDropdownVisible(true)}>
                        <FormInput 
                            type="text"
                            parentStyle="hover:cursor-pointer"
                            labelStyle="!top-1 text-[0.8em]" 
                            name="birthDateDay" 
                            label="Day" 
                            formData={formData} 
                            onChange={(e) => onChange(e)} 
                            isReadOnly={true} 
                        />
                        <IoIosArrowDown className="absolute top-4.5 right-3" size={20} fill={"gray"} />
                    </div>
                    { dayDropwdownVisible &&
                        <DayDropdown 
                            setDayDropdownVisible={setDayDropdownVisible} 
                            setFormData={setFormData} 
                            style="top-0 right-[38%] lg:right-[32%]" 
                        />
                    }
                    <div className="relative md:flex-1" onClick={() => setYearDropdownVisible(true)}>
                        <FormInput 
                            type="text"
                            parentStyle="hover:cursor-pointer"
                            labelStyle="!top-1 text-[0.8em]"  
                            name="birthDateYear" 
                            label="Year" 
                            formData={formData} 
                            onChange={(e) => onChange(e)} 
                            isReadOnly={true} 
                        />
                        <IoIosArrowDown className="absolute top-4.5 right-3" size={20} fill={"gray"} />
                    </div>
                    { yearDropdownVisible &&
                        <YearDropdown 
                            setYearDropdownVisible={setYearDropdownVisible} 
                            setFormData={setFormData} 
                            style="top-0 right-[13%]"
                        />
                    }
                </div>
            </div>

        </>
    );
}

export default PersonalInfo;