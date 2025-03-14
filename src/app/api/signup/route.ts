import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { formData } = await req.json();
    return NextResponse.json({ formData: formData });
}