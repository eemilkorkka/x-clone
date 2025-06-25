import { CustomEvents } from "@/types/CustomEvents";

export const sendVerificationEmail = async (email: string, name: string) => {
    try {
        await fetch("http://localhost:3000/api/verify/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                name: name,
            })
        });
    } catch (error) {
        console.log(error);
    }
}

export const follow = async (username: string) => {
    try {
        await fetch(`http://localhost:3000/api/users/${username}/follow`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });
        await triggerCustomEvent("follow-event", { action: "follow" })
    } catch (error) {
        console.log(error);
    }
}

// https://dev.to/adrianknapp/managing-application-state-with-custom-events-in-react-a-simple-yet-powerful-approach-ngd

export const triggerCustomEvent = <EventName extends keyof CustomEvents>(
    eventName: EventName,
    data: CustomEvents[EventName]
) => {
    const event = new CustomEvent(eventName, { detail: data })
    document.dispatchEvent(event)
}

export const uploadFiles = async (files: { url: string, file: File }[], formData: FormData) => {
    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i].file);
    }

    try {
        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData
        });

        return await response.json();
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const timeAgo = (timeStamp: Date) => {
    const now = new Date();
    const timeDiff = now.getTime() - timeStamp.getTime()

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(timeDiff / 3600000);

    if (seconds < 60) {
        return `${seconds}s`;
    }
    else if (minutes < 60) {
        return `${minutes}m`;
    }
    else if (hours < 24) {
        return `${hours}h`;
    }
    else {
        const month = timeStamp.toLocaleString('en-US', { month: 'short' });
        const day = timeStamp.getDate();
        return timeStamp.getFullYear() < now.getFullYear() ? `${month} ${day}, ${timeStamp.getFullYear()}` : `${month} ${day}`;
    }
}