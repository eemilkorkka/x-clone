import { ReturnBack } from "@/components/ui/ReturnBack";

export default function NotFound() {
    return (
        <div>
            <ReturnBack styles="m-2" />
            <div className="mt-24">
                <p className="text-zinc-500 text-center">Hmm... this page doesn't exist. Try searching for something else.</p>
            </div>
        </div>
    )
}