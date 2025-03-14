export const sendVerificationEmail: (email: string, name: string) => Promise<void> = async (email, name) => {
    try {
        const response = await fetch("http://localhost:3000/api/verify/email", {
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