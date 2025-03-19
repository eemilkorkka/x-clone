import { FormEvent, MouseEvent } from "react";

interface MultiStepFormProps {
    step: number;
    steps: React.JSX.Element[];
    formInvalid: boolean;
    handleNextClick: (e: MouseEvent<HTMLButtonElement>) => void;
    handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const MultiStepForm = ({ step, steps, formInvalid, handleNextClick, handleFormSubmit }: MultiStepFormProps) => {
    return (
        <form className="flex-1 flex flex-col justify-between" onSubmit={handleFormSubmit}>
            {steps[step]}
            <button
                disabled={formInvalid}
                type={step === steps.length - 1 ? "submit" : "button"} 
                className="bg-white mb-6 p-4 rounded-full hover:cursor-pointer text-black font-bold mt-auto disabled:opacity-40" 
                onClick={step < steps.length - 1 ? handleNextClick : undefined}
            >{step < steps.length - 1 ? "Next" : "Sign up"}
            </button>
        </form>
    );
}

export default MultiStepForm;