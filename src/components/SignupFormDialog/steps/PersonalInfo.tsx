import { useContext } from "react";
import FormInput from "../../Form/FormInput";
import { z } from "zod";
import { useFormValidation } from "@/hooks/useFormValidation";
import { personalInfoSchema } from "@/lib/schemas";
import { SignupFormContext } from "@/Context/SignupFormContext";
import BirthDateDropdowns from "@/components/Form/Dropdown/BirthDateDropdowns";

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const PersonalInfo = () => {

    const { formData, touchedFields, onChange, setFormInvalid } = useContext(SignupFormContext)!;

    const { getErrorMessage } = useFormValidation<PersonalInfoFormData>({
        formData: formData as PersonalInfoFormData,
        schema: personalInfoSchema,
        touchedFields,
        setFormInvalid
    });

    return (
        <div className="flex flex-col gap-8">
            <FormInput
                type="text"
                name="name"
                label="Name"
                formData={formData}
                onChange={onChange}
                error={getErrorMessage("name")}
            />
            <FormInput
                type="email"
                name="email"
                label="Email"
                formData={formData}
                onChange={(e) => { onChange(e); setFormInvalid(true); }}
                error={getErrorMessage("email")}
            />
            <div className="flex flex-col gap-1">
                <span className="font-bold">Date of birth</span>
                <p className="text-gray-500 text-[0.9em]">This will not be shown publicly. Confirm your own age,
                    even if this account is for a business, a pet, or something else.</p>
                <BirthDateDropdowns formData={formData} onChange={onChange} style="mt-2.5" />
            </div>
        </div>
    );
}

export default PersonalInfo;