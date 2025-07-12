import { useEffect } from "react"

export const useScrollListener = (scrollContainerId: string, handleScroll: () => void) => {
    useEffect(() => {
        const scrollContainer = document.getElementById(scrollContainerId);
        if (!scrollContainer) return;
            
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [handleScroll, scrollContainerId]);
}