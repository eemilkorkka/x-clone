import { timeStamp } from "console";

export const sendVerificationEmail = async (email: string, name: string) => {
    try {
        await fetch("http://localhost:3000/api/verify/email", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                email: email, 
                name: name, 
            })
        });
    } catch(error) {
        console.log(error);
    }
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