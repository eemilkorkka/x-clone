"use client";
import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormError from "@/components/FormError";
import { useDebounce } from "@/hooks/useDebounce";

interface UsernameProps {
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    formData: formDataType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Username = ({ formData, onChange, setFormInvalid }: UsernameProps) => {

    const [isUsernameValid, setIsUsernameValid] = useState<boolean | undefined>(undefined);
    const [errorText, setErrorText] = useState<string>("");
    const { username } = formData;
    const debouncedUsername = useDebounce(username, 500);

    useEffect(() => {

        if (debouncedUsername.length > 4) {
            setFormInvalid(true);
            setIsUsernameValid(false);
            setErrorText(formData.username === "" ? "" : "Username should at least be 4 characters long.");
            return;
        }

        const checkIfUsernameExists = async () => {
            const response = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(debouncedUsername)}`, {
                method: "GET"
            });

            const result = await response.json();

            if (result.user) {
                setFormInvalid(true);
                setIsUsernameValid(false);
                setErrorText(result.message);
            }
            else {
                setFormInvalid(false);
                setIsUsernameValid(true);
                setErrorText("");
            }
        }

        checkIfUsernameExists();
    }, [debouncedUsername])

    return (
        <>
            <FormInput 
                type="text" 
                name="username" 
                label="Username" 
                formData={formData} 
                onChange={onChange} 
                isValid={isUsernameValid} 
            />
            <FormError text={errorText} />
        </>
    );
}

export default Username;