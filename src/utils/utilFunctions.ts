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