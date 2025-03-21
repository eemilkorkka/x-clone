import formDataType from "@/types/formDataType";
import FormInput from "../../form/FormInput";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { passwordSchema } from "@/lib/schemas";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useContext } from "react";
import { SignupFormContext } from "@/context/signupFormContext";

type PasswordFormData = z.infer<typeof passwordSchema>;

const Password = () => {

    const { formData, touchedFields, onChange, setFormInvalid } = useContext(SignupFormContext)!;

    const { getErrorMessage } = useFormValidation<PasswordFormData>({
        formData: formData as PasswordFormData,
        schema: passwordSchema,
        touchedFields: touchedFields,
        setFormInvalid
    });

    return (
        <>
            <FormInput 
                type="password"
                name="password"
                label="Password"
                formData={formData}
                onChange={onChange}
                error={getErrorMessage("password") || getErrorMessage("confirmPassword")}
                errorStyle="mb-2"
            />
            <div className="mt-7">
                <FormInput 
                    type="password"
                    name="confirmPassword"
                    label="Confirm password"
                    formData={formData}
                    onChange={onChange}
                    error={getErrorMessage("confirmPassword")}
                />
            </div>
        </>
    );
}

export default Password;