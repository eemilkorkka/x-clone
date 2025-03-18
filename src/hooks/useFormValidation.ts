import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';
import { useDebounce } from './useDebounce';

interface UseFormValidationProps<T> {
    formData: T;
    schema: z.ZodSchema<T>;
    touchedFields?: string[];
    setFormInvalid: Dispatch<SetStateAction<boolean>>;
}

export function useFormValidation<T>({ formData, schema, touchedFields = [], setFormInvalid}: UseFormValidationProps<T>) {
    const [validationResult, setValidationResult] = useState<z.SafeParseReturnType<T, T>>();
    const debouncedFormData = useDebounce(formData, 500);

    useEffect(() => {
        const validateForm = async () => {
            const result = await schema.safeParseAsync(debouncedFormData);
            setValidationResult(result);
            setFormInvalid(!result.success);
        };
        
        validateForm();
    }, [debouncedFormData, schema, setFormInvalid]);

    const getErrorMessage = (field: keyof T) => {
        if (!touchedFields.includes(field as string) || formData !== debouncedFormData) return "";
        
        if (!validationResult?.success) {
            return validationResult?.error?.issues.find(issue => issue.path[0] === field)?.message;
        }
        return "";
    };

    return {
        isValid: validationResult?.success ?? false,
        getErrorMessage,
        errors: validationResult?.success ? {} : validationResult?.error.formErrors,
    };
} 