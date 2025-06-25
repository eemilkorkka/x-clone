import { CustomEvents } from "@/types/CustomEvents";
import { useEffect } from "react";

// https://dev.to/adrianknapp/managing-application-state-with-custom-events-in-react-a-simple-yet-powerful-approach-ngd

export function useEventListener<T extends keyof CustomEvents>(
    eventName: T,
    handler: (detail: CustomEvents[T]) => void
) {
    useEffect(() => {
        const eventHandler = (event: CustomEvent<CustomEvents[T]>) => {
            handler(event.detail);
        }

        document.addEventListener(eventName, eventHandler as EventListener);
        return () => {
            document.removeEventListener(eventName, eventHandler as EventListener);
        }
    }, [eventName, handler])
}