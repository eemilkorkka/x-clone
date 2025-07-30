import FormInput from "@/components/Form/FormInput";
import Formdata from "@/types/Formdata";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { emailOrUsernameSchema } from "@/lib/schemas";
import { z } from "zod";

interface FindAccountProps {
    formData: Formdata,
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
    touchedFields: string[];
}

type emailOrUsernameFormData = z.infer<typeof emailOrUsernameSchema>;

const FindAccount = ({ formData, onInputChange, setFormInvalid, touchedFields }: FindAccountProps) => {

    const { getErrorMessage } = useFormValidation<emailOrUsernameFormData>({
        formData: formData as emailOrUsernameFormData,
        schema: emailOrUsernameSchema,
        touchedFields: touchedFields,
        setFormInvalid: setFormInvalid
    });

    return (
        <div className="flex flex-col gap-8">
            <p className="text-gray-500">Enter the email or username associated with your <br /> account  to change your password.</p>
            <FormInput
                type="text"
                name="email_or_username"
                label="Email or username"
                formData={formData}
                error={getErrorMessage("email_or_username")}
                errorStyle="whitespace-pre-line"
                onChange={(e) => { onInputChange(e); setFormInvalid(true); }}
            />
        </div>
    );
}

export default FindAccount;