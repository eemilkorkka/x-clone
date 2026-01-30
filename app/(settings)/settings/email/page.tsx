"use client";

import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import z from "zod";

const formSchema = z.object({
    email: emailSchema
});

export default function EmailPage() {
    
    const { data } = authClient.useSession();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: data?.user.email || ""
        }
    });

    if (!data) {
        return router.push("/");
    }
    
    return (
        <form>
        
        </form>
    )
}