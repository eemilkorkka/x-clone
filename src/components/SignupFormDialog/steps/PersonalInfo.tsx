"use client";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import FormInput from "../FormInput";
import formDataType from "@/types/formDataType";
import Dropdown from "@/components/Dropdown";
import { dropdownFields } from "../../../utils/birthDateDropdowns";
import { z } from "zod";
import { useFormValidation } from "@/hooks/useFormValidation";
import { personalInfoSchema } from "@/lib/schemas";

interface PersonalInfoProps {
    formData: formDataType;
    touchedFields: string[];
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const PersonalInfo = ({ formData, touchedFields, onChange, setFormInvalid }: PersonalInfoProps) => {
    
    const { getErrorMessage } = useFormValidation<PersonalInfoFormData>({
        formData: formData as PersonalInfoFormData,
        schema: personalInfoSchema,
        touchedFields,
        setFormInvalid
    });

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
                    error={getErrorMessage("email")}
                />
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