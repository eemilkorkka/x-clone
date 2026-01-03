import { Button } from "@/components/ui/button"

export const FormButton = ({ disabled = false }: { disabled?: boolean}) => {
    return (
        <Button type="submit" disabled={disabled} variant="secondary" className="rounded-full font-bold w-full py-6 mb-4 hover:cursor-pointer">Next</Button>
    )
}