"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormError from "@/components/FormError";

interface UsernameProps {
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Username = ({ formData, onChange, setFormInvalid }: UsernameProps) => {

    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        const checkIfUsernameExists: () => Promise<void> = async () => {
            if (formData.username.length > 4) {

                const response = await fetch(`http://localhost:3000/api/users/${formData.username}`, {
                    method: "GET"
                });

                const result = await response.json();

                if (result.user) {
                    setFormInvalid(true);
                    setErrorText(result.message);
                }
                else {
                    setFormInvalid(false);
                    setErrorText("");
                }
            }
            else {
                setFormInvalid(true);
            }      
        }

        checkIfUsernameExists();
    }, [formData.username])

    return (
        <>
            <FormInput type="text" name="username" label="Username" formData={formData} onChange={(e) => onChange(e)} />
            <FormError text={errorText} />
        </>
    );
}

export default Username;