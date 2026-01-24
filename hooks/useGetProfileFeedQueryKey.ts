import { useParams, usePathname } from "next/navigation";

export const useGetProfileFeedQueryKey = () => {
    const pathname = usePathname();
    const params = useParams();

    const segments = pathname.split('/').filter(Boolean);
    const username = params.username;
    const pageType = pathname === "/compose/post" ? "posts" : segments[1];

    const profileFeedQueryKey = ["profilefeed", pageType ?? "posts", username, pageType === 'replies'];
    
    return profileFeedQueryKey;
}