import { Button } from "@/components/ui/button"

export const FormButton = ({ disabled = false }: { disabled?: boolean}) => {

    return (
        <Button type="submit" disabled={disabled} className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold w-full py-6 mb-4 hover:cursor-pointer">Next</Button>
    )
}