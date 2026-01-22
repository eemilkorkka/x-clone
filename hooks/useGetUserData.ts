import { useQuery } from "@tanstack/react-query";

const getUserInfo = async (username: string) => {
    const response = await fetch(`/api/users/${username}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to get user's info.");
    }
}

export const useGetUserData = (username: string, enabled: boolean = true) => {
    
    const { data, isLoading, error } = useQuery({
        queryFn: () => getUserInfo(username),
        queryKey: ["user", username],
        enabled: enabled && !!username
    });

    return { data, isLoading, error };
}