"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

interface UsernameProps {
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Username = ({ formData, onChange, setFormInvalid }: UsernameProps) => {

    useEffect(() => {
        if (formData.username.length < 4) {
            setFormInvalid(true);
        }
        else {
            setFormInvalid(false);
        }
    }, [formData.username])

    return (
        <>
            <FormInput type="text" name="username" label="Username" formData={formData} onChange={(e) => onChange(e)} />
        </>
    );
}

export default Username;