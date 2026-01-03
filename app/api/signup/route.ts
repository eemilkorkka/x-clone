import { prisma } from "@/lib/prisma";
import { createUsernameSchemaBackend, personalInfoSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { formData, password } = await req.json();

    const { 
        name, 
        email, 
        month, 
        day, 
        year, 
        verificationCode,
        username 
    } = formData;

    const usernameSchema = createUsernameSchemaBackend(prisma);

    const validatedResult = await personalInfoSchema.and(usernameSchema).safeParseAsync(formData);

    if (!validatedResult.success) {
        return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
    }

    try {
        const verificationCode = await prisma.signupVerification.findUnique({
            where: {
                email: email,
            }
        });

        if (!verificationCode) {
            return NextResponse.json({ message: "Couldn't find verification code." }, { status: 404 });
        }
        
        const EXPIRY_DURATION = 10 * 60 * 1000;
        const expiryTime = new Date(verificationCode.createdAt.getTime() + EXPIRY_DURATION);
        const isExpired = new Date() > expiryTime;

        if (isExpired) {
            return NextResponse.json({ message: "Verification code has expired." }, { status: 410 });
        }

        if (Number(verificationCode) !== verificationCode.verificationCode) {
            return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
        }

        

    } catch (error) {

    }
}