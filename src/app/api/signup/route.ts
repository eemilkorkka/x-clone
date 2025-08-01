import { NextResponse } from "next/server";
import { personalInfoSchema, verificationCodeSchema, usernameSchema, passwordSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { formData } = await req.json();

    const formDataSchema = personalInfoSchema
    .and(verificationCodeSchema)
    .and(usernameSchema)
    .and(passwordSchema);

    const result = formDataSchema.safeParseAsync(formData);

    const error = await (await result).error;

    if ((await result).success) {
        try {
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            await prisma.users.create({
                data: {
                    Name: formData.name,
                    DisplayName: formData.name,
                    Email: formData.email,
                    BirthDateMonth: formData.birthDateMonth,
                    BirthDateDay: formData.birthDateDay,
                    BirthDateYear: formData.birthDateYear,
                    Username: formData.username,
                    Password: hashedPassword
                }
            });

            return NextResponse.json({ message: "Signup successful!" }, { status: 201});
        } catch (error) {
            console.log(error);
            return NextResponse.json({ message: "Signup failed." }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Something went wrong.", error: error }, { status: 400 });
    }
}