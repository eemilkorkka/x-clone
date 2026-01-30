import { Button } from "@/components/ui/button"

interface FormButtonProps {
    title?: string;
    disabled?: boolean;
}

export const FormButton = ({ title = "Next", disabled = false }: FormButtonProps) => {
    return (
        <Button type="submit" disabled={disabled} className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold w-full py-6 mb-4 hover:cursor-pointer">{title}</Button>
    )
}