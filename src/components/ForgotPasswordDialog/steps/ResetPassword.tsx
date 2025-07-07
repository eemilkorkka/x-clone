import FormInput from "@/components/Form/FormInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import { passwordSchema } from "@/lib/schemas";
import formDataType from "@/types/formDataType";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { z } from "zod";

interface ResetPasswordProps {
    formData: formDataType;
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    touchedFields: string[];
}

type resetPasswordFormData = z.infer<typeof passwordSchema>;

const ResetPassword = ({ formData, onInputChange, setFormInvalid, touchedFields }: ResetPasswordProps) => {
    
    const { getErrorMessage } = useFormValidation<resetPasswordFormData>({
        formData: formData as resetPasswordFormData,
        schema: passwordSchema,
        touchedFields: touchedFields,
        setFormInvalid: setFormInvalid
    });
    
    const passwordErrorMsg = getErrorMessage("password") || getErrorMessage("confirmPassword");

    return (
        <div className={`mt-4 flex flex-col ${passwordErrorMsg ? "gap-15" : "gap-8"} max-w-90`}>
            <FormInput
                type="password"
                name="password"
                label="New password"
                formData={formData}
                onChange={(e) => { onInputChange(e); setFormInvalid(true) }}
                error={passwordErrorMsg}
            />
            <FormInput
                type="password"
                name="confirmPassword"
                label="Confirm password"
                formData={formData}
                onChange={(e) => { onInputChange(e); setFormInvalid(true) }}
                error={getErrorMessage("confirmPassword")}
            />
        </div>
    );
}

export default ResetPassword;