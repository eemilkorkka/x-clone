"use client"
import Formdata from "@/types/Formdata";
import { ChangeEvent, createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

type SignupFormContextType = {
    formData: Formdata;
    formInvalid: boolean;
    touchedFields: string[];
    setFormData: Dispatch<SetStateAction<Formdata>>;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const SignupFormContext = createContext<undefined | SignupFormContextType>(undefined);

export default function SignupFormContextProvider({ children }: { children: ReactNode }) {

    const [formData, setFormData] = useState<Formdata>({
        name: "",
        email: "",
        birthDateMonth: "",
        birthDateDay: "",
        birthDateYear: "",
        verificationCode: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [touchedFields, setTouchedFields] = useState<string[]>([]);
    const [formInvalid, setFormInvalid] = useState<boolean>(true);

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (!touchedFields.includes(name)) {
            setTouchedFields(prev => [...prev, name]);
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === "name" ? value : value.trim(),
        }));
    }

    return (
        <SignupFormContext.Provider value={{ formData, formInvalid, touchedFields, setFormData, setFormInvalid, onChange }}>
            {children}
        </SignupFormContext.Provider>
    );
}   