"use client";
import { useQuery } from "@tanstack/react-query";

export const useCheckImageAvailability = (url: string) => {

    /* Due to usage limits within the free tier of appwrite storage, we might sometimes get a 
      402 Payment Required response when trying to access an image, so this custom hook will check for that.
    */

    const isAppwriteResource = url.includes("cloud.appwrite.io");

    const {
        data: success,
    } = useQuery({
        queryFn: async () => {
            const response = await fetch(url);
            return response.ok;
        },
        queryKey: ["profilePicture"],
        enabled: isAppwriteResource
    });

    return { success, isAppwriteResource };
}