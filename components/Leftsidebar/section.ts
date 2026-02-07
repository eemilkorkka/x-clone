export const getSelectedSection = (path: string) => {
    if (path.startsWith("/settings")) return "Settings and privacy";

    if (path.startsWith("/home")) return "Home";

    if (path.startsWith("/bookmarks")) return "Bookmarks";

    return undefined;
}