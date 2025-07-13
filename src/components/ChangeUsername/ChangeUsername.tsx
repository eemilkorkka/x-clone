"use client";
import { useState, ChangeEvent } from "react";
import { Session } from "next-auth";
import FormInput from "../Form/FormInput";
import formDataType from "@/types/formDataType";
import Button from "../Shared/Button";
import { useFormValidation } from "@/hooks/useFormValidation";
import { usernameSchema } from "@/lib/schemas";
import { z } from "zod";
import toast from "react-hot-toast";

interface ChangeUsernameProps {
    session: Session | null;
}

type usernameFormData = z.infer<typeof usernameSchema>;

const ChangeUsername = ({ session }: ChangeUsernameProps) => {

    const [formInvalid, setFormInvalid] = useState<boolean>(true);
    const [touchedFields, setTouchedFields] = useState<string[]>([]);
    const [formData, setFormData] = useState<formDataType>({
        username: session?.user.username ?? ""
    });

    const { getErrorMessage } = useFormValidation<usernameFormData>({
        formData: formData as usernameFormData,
        schema: usernameSchema,
        touchedFields: touchedFields,
        setFormInvalid: setFormInvalid
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (!touchedFields.includes(name)) {
            setTouchedFields(prev => [...prev, name]);
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const saveChanges = async () => {
        const response = await fetch("/api/profile/edit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ formData: formData })
        });

        const json = await response.json();

        if (response.ok) {
            toast.success(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        } else {
            toast.error(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        }
    }

    return (
        <div className="flex justify-center">
            <form className="flex flex-col gap-4 w-100">
                <FormInput
                    type="text"
                    name="username"
                    label="Username"
                    formData={formData}
                    onChange={(e) => onInputChange(e)}
                    error={getErrorMessage("username")}
                    style="border-gray-300"
                />
                <Button disabled={formInvalid} style="w-18 text-sm py-2 self-end" onClick={saveChanges}>Save</Button>
            </form>
        </div>
    );
}

export default ChangeUsername;