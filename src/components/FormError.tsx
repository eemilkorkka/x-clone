interface FormErrorProps {
    text: string;
}
const FormError = ({ text }: FormErrorProps) => {
    return (
        <p className="text-red-500 h-4 mt-2">{text}</p>
    );
}

export default FormError;