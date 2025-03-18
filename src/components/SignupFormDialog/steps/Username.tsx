import formDataType from "@/types/formDataType";
import FormInput from "../FormInput";
import { z } from "zod";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import FormError from "@/components/FormError";
import { useFormValidation } from "@/hooks/useFormValidation";
import { usernameSchema } from "@/lib/schemas";

interface UsernameProps {
    formData: formDataType;
    touchedFields: string[];
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

type UsernameFormData = z.infer<typeof usernameSchema>;

const Username = ({ formData, touchedFields, onChange, setFormInvalid }: UsernameProps) => {

    const { getErrorMessage } = useFormValidation<UsernameFormData>({
        formData: formData as UsernameFormData,
        schema: usernameSchema,
        touchedFields: touchedFields,
        setFormInvalid
    });

    return (
        <>
            <FormInput 
                type="text" 
                name="username" 
                label="Username" 
                formData={formData} 
                onChange={onChange}
                error={getErrorMessage("username")} 
            />
        </>
    );
}

export default Username;