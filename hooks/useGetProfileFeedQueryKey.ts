import { useParams, usePathname } from "next/navigation";

export const useGetProfileFeedQueryKey = () => {
    const pathname = usePathname();
    const params = useParams();

    const segments = pathname.split('/').filter(Boolean);
    const username = params.username as string;
    const pageType = segments[1];

    const profileFeedQueryKey = pageType
        ? ["profilefeed", pageType, username, pageType === 'replies']
        : ["profilefeed", "posts", username, false];

    return profileFeedQueryKey;
}