import React, { ReactNode } from "react";
import FormInput from "./FormInput";
import formDataType from "@/types/formDataType";

type FormInputs = {
    type: string;
    name: string;
    label: string;
    style?: string;
    maxLength?: number;
    isTextArea?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface FormProps {
    localFormData: formDataType;
    formInputs: FormInputs[];
    style?: string;
    children: ReactNode;
}

const Form = ({ formInputs, localFormData, style, children }: FormProps) => {
    return (
        <form className={`flex flex-col gap-8 p-2 ${style}`}>
            {formInputs.map((input, index) => {
                return (
                    <React.Fragment key={index}>
                        <FormInput
                            type={input.type}
                            name={input.name}
                            label={input.label}
                            formData={localFormData}
                            style={input.style}
                            maxLength={input.maxLength}
                            isTextArea={input.isTextArea}
                            onChange={input.onChange}
                        />
                    </React.Fragment>
                )
            })}
            {children}
        </form>
    );
}

export default Form;