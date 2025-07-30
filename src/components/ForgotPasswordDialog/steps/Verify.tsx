import FormInput from "@/components/Form/FormInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import Formdata from "@/types/Formdata";
import { ChangeEvent, SetStateAction, Dispatch } from "react";
import { passwordResetCodeSchema } from "@/lib/schemas";
import { z } from "zod";

interface VerifyProps {
    formData: Formdata,
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    touchedFields: string[];
}

type passwordResetCodeFormData = z.infer<typeof passwordResetCodeSchema>;

const Verify = ({ formData, onInputChange, setFormInvalid, touchedFields }: VerifyProps) => {
    
    const { getErrorMessage } = useFormValidation<passwordResetCodeFormData>({
        formData: formData as passwordResetCodeFormData,
        schema: passwordResetCodeSchema,
        touchedFields: touchedFields,
        setFormInvalid: setFormInvalid
    });

    return (
        <div className="flex flex-col gap-8">
            <p className="text-gray-500">Enter it below to continue resetting your password.</p>
            <FormInput 
                type="text" 
                name="passwordResetCode" 
                label="Code" 
                formData={formData} 
                onChange={(e) => { onInputChange(e); setFormInvalid(true) }} 
                error={getErrorMessage("passwordResetCode")}
            />
        </div>
    );
}

export default Verify;