import FormInput from "../../form/FormInput";
import { z } from "zod";
import { useFormValidation } from "@/hooks/useFormValidation";
import { usernameSchema } from "@/lib/schemas";
import { useContext } from "react";
import { SignupFormContext } from "@/context/SignupFormContext";

type UsernameFormData = z.infer<typeof usernameSchema>;

const Username = () => {

    const { formData, touchedFields, setFormInvalid, onChange } = useContext(SignupFormContext)!;

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