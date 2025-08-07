import { auth } from "@/auth";
import { storage } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const formData = await req.formData();
    const files = formData.getAll("file");
    const urls: { url: string; type: string }[] = [];

    for (const file of files) {
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ message: "No file uploaded or invalid file type" }, { status: 400 });
        }

        try {
            const response = await storage.createFile(process.env.APPWRITE_BUCKET_ID!, "unique()", file);
            const fileId = response.$id;

            const fileUrl = `https://${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
            urls.push({ url: fileUrl, type: file.type });

        } catch (error) {
            console.log(error);
            return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
        }
    }

    return NextResponse.json({ urls: urls }, { status: 200 });
}