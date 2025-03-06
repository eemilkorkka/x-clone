import { NextResponse } from "next/server";

export async function POST(req: Request) {
    /* Here we will be adding the user's email to our db along with a 6 digit verification code and sending them a verification email. 
    (Or updating the verification code in case the email already exits in the database.) */

    const { name, email } = await req.json();
    return NextResponse.json({ message: `Received the email address ${email} from a person named ${name}`});
}