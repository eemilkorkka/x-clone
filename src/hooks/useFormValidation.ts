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
            // Try to parse synchronously first, if it fails with an async error, then use async parse
            try {
                const result = schema.safeParse(debouncedFormData);
                setValidationResult(result);
                setFormInvalid(!result.success);
            } catch (error) {
                const result = await schema.safeParseAsync(debouncedFormData);
                setValidationResult(result);
                setFormInvalid(!result.success);
            }
        };
        
        validateForm();
    }, [debouncedFormData, schema, setFormInvalid]);

    const getErrorMessage = (field: keyof T) => {   
        if (formData !== debouncedFormData) return "";

        console.log(touchedFields);
        
        if (!validationResult?.success && touchedFields.includes(field as string)) {
            return validationResult?.error?.issues.find(issue => issue.path[0] === field)?.message;
        }
    };

    return {
        isValid: validationResult?.success ?? false,
        getErrorMessage,
        errors: validationResult?.success ? {} : validationResult?.error.formErrors,
    }
} 