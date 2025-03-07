import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Email parameter is required' });
        return;
    }

    try {
        const user = await prisma.users.findFirst({
            where: {
                Email: email
            }
        })
        return user ? res.status(200).json({ user: user }) : res.status(404).json({ user: null });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}