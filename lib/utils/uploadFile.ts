"use server";

import { ID } from "node-appwrite";
import { storage } from "../appwrite";

export const uploadFile = async (file: File) => {
    const response = await storage.createFile({
        bucketId: process.env.APPWRITE_BUCKET_ID!,
        fileId: ID.unique(),
        file: file
    });
    
    const fileId = response.$id;

    return `https://${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
}