import { User } from "@/types/User";

export const sendVerificationEmail = async (email: string, name: string) => {
    try {
        await fetch("/api/verify/email", {
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

export const sendPasswordResetEmail = async (email_or_username: string): Promise<string> => {
    try {
        const response = await fetch("/api/resetpassword/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email_or_username: email_or_username
            })
        });

        const json = await response.json();

        return json.email;
    } catch (error) {
        console.log(error);
    }

    return "";
}

export const follow = async (username: string) => {
    try {
        const response = await fetch(`/api/users/${username}/follow`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const uploadFiles = async (files: { url: string, file: File }[], formData: FormData) => {
    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i].file);
    }

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        return await response.json();
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const fetchUserData = async (username: string): Promise<User> => {
    const response = await fetch(`/api/users/${username}`);
    const json = await response.json();
    return json.user;
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
