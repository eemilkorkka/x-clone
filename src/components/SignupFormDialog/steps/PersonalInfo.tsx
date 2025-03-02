"use client";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import FormError from "@/components/FormError";
import { IoIosArrowDown } from "react-icons/io";
import MonthDropdown from "../MonthDropdown";
import MonthSelect from "../MonthDropdown";

interface PersonalInfoProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    formData: formDataType;
    setFormData: Dispatch<SetStateAction<formDataType>>;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const PersonalInfo = ({ onChange, formData, setFormData, setFormInvalid }: PersonalInfoProps) => {

    const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
    const [monthDropdownVisible, setMonthDropdownVisible] = useState<boolean>(false);
    const { name, email, birthDateMonth } = formData;

    useEffect(() => {
        const validateEmail = () => {
            email.match(emailPattern) ? setIsValidEmail(true) : setIsValidEmail(false);
        }
        validateEmail();
    }, [email])

    useEffect(() => {
        if (name === "" || email === "" || !isValidEmail) {
            setFormInvalid(true);
        }
        else {
            setFormInvalid(false);
        }
    }, [name, email])

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
                {!isValidEmail && email != "" && <FormError text="Email is invalid. Please enter a valid email address." />}
            </div>
            <div className="flex flex-col gap-1 mt-10">
                <span className="font-bold">Date of birth</span>
                <p className="text-gray-500 text-[0.9em]">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                <div className="flex gap-3 mt-2.5">
                    <div className="relative" onClick={() => setMonthDropdownVisible(true)}>
                        <FormInput 
                            type="text" 
                            parentStyle={"hover:cursor-pointer"}
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
                            formData={formData} 
                            setFormData={setFormData} 
                            setMonthDropdownVisible={setMonthDropdownVisible} 
                        /> 
                    }
                    <div className="relative md:flex-1">
                        <FormInput 
                            type="text"
                            labelStyle="!top-1 text-[0.8em]" 
                            name="birthDateDay" 
                            label="Day" 
                            formData={formData} 
                            onChange={(e) => onChange(e)} 
                            isReadOnly={true} 
                        />
                        <IoIosArrowDown className="absolute top-4.5 right-3" size={20} fill={"gray"} />
                    </div>
                    <div className="relative md:flex-1">
                        <FormInput 
                            type="text"
                            labelStyle="!top-1 text-[0.8em]"  
                            name="birthDateYear" 
                            label="Year" 
                            formData={formData} 
                            onChange={(e) => onChange(e)} 
                            isReadOnly={true} 
                        />
                        <IoIosArrowDown className="absolute top-4.5 right-3" size={20} fill={"gray"} />
                    </div>
                </div>
            </div>

        </>
    );
}

export default PersonalInfo;