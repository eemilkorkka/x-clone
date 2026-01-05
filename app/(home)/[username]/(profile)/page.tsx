import { getSession } from "@/lib/session"
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    
    const session = await getSession();

    if (!session) {
        redirect("/");
    }
    
    return (
        <div>
        </div>
    )
}