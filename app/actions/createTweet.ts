"use server";

import { FileType } from "@/generated/prisma/enums";
import { storage } from "@/lib/appwrite";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { uploadFile } from "@/lib/utils/uploadFile";
import z from "zod";

const tweetFormSchema = z.object({
    tweetContent: z.string().max(280, "Tweet cannot exceed 280 characters.").optional(),
    files: z.array(z.instanceof(File)).max(4).optional()
}).refine(
    (data) => {
        const hasContent = data.tweetContent && data.tweetContent.trim().length > 0;
        const hasFiles = data.files && data.files.length > 0
        return hasContent || hasFiles;
    },
    {
        message: "Either tweet content or at least one file is required"
    }
);

export async function createTweet(previousState: any, formData: FormData) {

    const session = await getSession();

    if (!session) return { error: "Not authenticated." }

    const parentTweetId = formData.get("parentTweetId") as string;
    const tweetContent = formData.get("tweetContent") as string;
    const files = formData.getAll("file") as File[];

    const actualFiles = files.filter((file) => file.size > 0);
    const parentId = parentTweetId ? parseInt(parentTweetId) : null;

    const parsedData = tweetFormSchema.safeParse({
        tweetContent,
        files: actualFiles
    });
    
    const uploadedFileIds: string[] = [];

    if (!parsedData.success) {
        return { error: "Invalid form data.", success: false };
    }

    try {
        const tweet = await prisma.tweet.create({
            data: {
                userId: session.user.id,
                tweetContent: tweetContent,
                parentTweetId: parentId
            }
        });

        for (const file of actualFiles) {
            if (!(file instanceof File)) return;

            try {
                const fileUrl = await uploadFile(file);
                const fileId = fileUrl.split("/")[8];
                const fileType = file.type.includes("video") ? FileType.VIDEO : FileType.IMAGE;
                
                uploadedFileIds.push(fileId);

                await prisma.file.create({
                    data: {
                        tweetId: tweet.id,
                        url: fileUrl,
                        type: fileType
                    }
                });

            } catch (error) {
                await prisma.tweet.delete({
                    where: {
                        id: tweet.id
                    }
                });

                await Promise.allSettled(
                    uploadedFileIds.map((id) =>
                        storage.deleteFile({
                            bucketId: process.env.APPWRITE_BUCKET_ID!,
                            fileId: id
                        })
                    )
                );
                
                return { success: false, error: "Failed to upload tweet attachment(s)" };
            }
        }

        return { success: true, message: "Post created successfully" };
    } catch (error) {
        return { success: false, error: "Post creation failed. Try again later." };
    }
}
