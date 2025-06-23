import { useRef, useCallback } from 'react';

export const useInfiniteScroll = (
    isFetching: boolean, 
    hasNextPage: boolean, 
    fetchNextPage: () => void
) => {
    const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
    
    return useCallback(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (!scrollContainer) return;

        if (throttleTimeout.current) return;

        throttleTimeout.current = setTimeout(() => {
            if (
                scrollContainer.offsetHeight + scrollContainer.scrollTop >= scrollContainer.scrollHeight - 100
            ) {
                if (!isFetching && hasNextPage) {
                    fetchNextPage();
                }
            }
            throttleTimeout.current = null;
        }, 500);
    }, [isFetching, hasNextPage, fetchNextPage]);
};

export default useInfiniteScroll;