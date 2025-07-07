import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/schemas";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const { formData } = await req.json();

    const passwords = {
        password: formData.password,
        confirmPassword: formData.confirmPassword
    };

    const result = passwordSchema.safeParseAsync(passwords);

    if ((await result).success) {
        try {
            const hashedPassword = await bcrypt.hash(passwords.password, 10);

            await prisma.users.update({
                where: {
                    Email: formData.email_or_username
                },
                data: {
                    Password: hashedPassword
                }
            });

            return NextResponse.json({ message: "Password changed successfully." }, { status: 200 });
        } catch {
            return NextResponse.json({ message: "An error occurred whilst trying to change password." }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Invalid password provided." }, { status: 400 });
    }
}