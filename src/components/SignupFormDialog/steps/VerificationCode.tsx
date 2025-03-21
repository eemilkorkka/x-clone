import FormInput from "../../form/FormInput";
import { sendVerificationEmail } from "@/utils/utilFunctions";
import { z } from "zod";
import { useFormValidation } from "@/hooks/useFormValidation";
import { verificationCodeSchema } from "@/lib/schemas";
import { useContext } from "react";
import { SignupFormContext } from "@/context/signupFormContext";

type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

const VerificationCode = () => {

    const { formData, touchedFields, onChange, setFormInvalid, setFormData } = useContext(SignupFormContext)!;

    const { getErrorMessage } = useFormValidation<VerificationCodeFormData>({
        formData: formData as VerificationCodeFormData,
        schema: verificationCodeSchema,
        touchedFields: touchedFields,
        setFormInvalid,
    });

    const handleResendCode = () => {
        sendVerificationEmail(formData.email, formData.name);
        setFormData(prev => ({
            ...prev,
            verificationCode: ""
        }));
    }

    return (
        <>
            <p className="text-gray-500 mb-5">Enter it below to verify {formData.email}</p>
            <FormInput 
                type="text" 
                name="verificationCode" 
                label="Verification code" 
                formData={formData} 
                onChange={(e) => { onChange(e); setFormInvalid(true) }} 
                error={getErrorMessage("verificationCode")}
            />
            <p 
                className="text-gray-500 mt-3">Didn't receive code?
                <span 
                    className="text-xblue hover:cursor-pointer" 
                    onClick={handleResendCode}
                    > Resend code
                </span>
            </p>
        </>
    );
}

export default VerificationCode;