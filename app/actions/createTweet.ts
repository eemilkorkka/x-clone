"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import z from "zod";

const tweetFormSchema = z.object({
    tweetContent: z.string().max(280).optional(),
    files: z.array(z.instanceof(File)).optional()
}).refine(
    (data) => {
        const hasContent = data.tweetContent && data.tweetContent.trim().length > 0;
        const hasFiles = data.files && data.files.length > 0;
        return hasContent || hasFiles;
    },
    {
        message: "Either tweet content or at least one file is required"
    }
);

export async function createTweet(previousState: any, formData: FormData) {

    const session = await getSession();

    if (!session) return { error: "Not authenticated." }

    const tweetContent = formData.get("tweetContent") as string;
    const files = formData.getAll("file") as File[];
    const actualFiles = files.filter((file) => file.size > 0);

    const parsedData = tweetFormSchema.safeParse({
        tweetContent,
        actualFiles
    });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const tweet = await tx.tweet.create({
                data: {
                    userId: session.user.id,
                    tweetContent: tweetContent
                }
            });

            return tweet;
        });

        return { success: true };
    } catch (error) {
        return { error: "Post creation failed. Try again later." };
    }
}