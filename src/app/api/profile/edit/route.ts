import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const { formData } = await req.json();

    try {
        const updatedUser = await prisma.users.update({
            where: { UserID: parseInt(session.user.id) },
            data: {
                DisplayName: formData.name,
                Bio: formData.bio,
                Location: formData.location,
                Website: formData.website,
                ProfilePicture: formData.profilePicture,
                CoverPicture: formData.coverPicture
            }
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "Failed to save changes." }, { status: 500 });
        }

        return NextResponse.json({ message: "Changes saved successfully." }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
    }
}